import { Types } from "mongoose";

import { HTTP_STATUS } from "@/constants";
import { CartItemModel, CartModel } from "@/modules/carts/carts.model";
import {
  AddCartItemInput,
  UpdateCartItemInput,
  UpdateCartStoreInput
} from "@/modules/carts/carts.validation";
import { InventoryModel } from "@/modules/inventories/inventories.model";
import {
  PRODUCT_STATUSES,
  PRODUCT_VARIANT_STATUSES,
  ProductImageModel,
  ProductModel,
  ProductVariantModel
} from "@/modules/products/products.model";
import { StoreModel, STORE_STATUSES } from "@/modules/stores/stores.model";
import { ApiError } from "@/utils/ApiError";

const getActiveCart = async (userId: string | Types.ObjectId) => {
  const existingCart = await CartModel.findOne({ user: userId });

  if (existingCart) {
    return existingCart;
  }

  return CartModel.create({
    user: userId,
    store: null
  });
};

const getAvailableQuantity = async (
  storeId: string | Types.ObjectId,
  variantId: string | Types.ObjectId
) => {
  const inventory = await InventoryModel.findOne({
    store: storeId,
    variant: variantId
  });

  return inventory ? inventory.quantity - inventory.reservedQuantity : 0;
};

const getActiveVariantOrFail = async (variantId: string) => {
  const variant = await ProductVariantModel.findById(variantId);

  if (!variant || variant.status !== PRODUCT_VARIANT_STATUSES.ACTIVE) {
    throw new ApiError("Product variant is not available", HTTP_STATUS.BAD_REQUEST);
  }

  const product = await ProductModel.findOne({
    _id: variant.product,
    status: PRODUCT_STATUSES.ACTIVE
  });

  if (!product) {
    throw new ApiError("Product is not available", HTTP_STATUS.BAD_REQUEST);
  }

  return variant;
};

const getPriceSnapshot = (variant: { price: number; salePrice?: number }) =>
  variant.salePrice ?? variant.price;

const getSelectedStoreOrFail = (store?: Types.ObjectId | null) => {
  if (!store) {
    throw new ApiError("Please select a store before adding items", HTTP_STATUS.BAD_REQUEST);
  }

  return store;
};

const assertAvailableStock = async (
  store: string | Types.ObjectId,
  variant: string | Types.ObjectId,
  quantity: number
) => {
  const availableQuantity = await getAvailableQuantity(store, variant);

  if (quantity > availableQuantity) {
    throw new ApiError("Cart quantity exceeds available stock", HTTP_STATUS.BAD_REQUEST);
  }
};

const buildCartResponse = async (cartId: Types.ObjectId) => {
  const cart = await CartModel.findById(cartId).populate("store").lean();

  if (!cart) {
    throw new ApiError("Cart not found", HTTP_STATUS.NOT_FOUND);
  }

  const items = await CartItemModel.find({ cart: cartId })
    .populate({
      path: "variant",
      populate: {
        path: "product",
        populate: [{ path: "category" }, { path: "brand" }]
      }
    })
    .sort({ createdAt: 1 })
    .lean();

  const productIds = items
    .map((item) => {
      const variant = item.variant as unknown as { product?: { _id?: Types.ObjectId } };

      return variant.product?._id;
    })
    .filter(Boolean);

  const images = await ProductImageModel.find({ product: { $in: productIds } })
    .sort({ isThumbnail: -1, sortOrder: 1 })
    .lean();

  const hydratedItems = items.map((item) => {
    const variant = item.variant as unknown as { product?: { _id?: Types.ObjectId } };
    const productId = variant.product?._id ? String(variant.product._id) : "";

    return {
      ...item,
      product: variant.product,
      images: images.filter((image) => String(image.product) === productId)
    };
  });

  const subtotal = hydratedItems.reduce(
    (sum, item) => sum + item.priceSnapshot * item.quantity,
    0
  );

  return {
    ...cart,
    items: hydratedItems,
    subtotal,
    totalItems: hydratedItems.reduce((sum, item) => sum + item.quantity, 0)
  };
};

export const getMyCart = async (userId: string | Types.ObjectId) => {
  const cart = await getActiveCart(userId);

  return buildCartResponse(cart._id);
};

export const addCartItem = async (
  userId: string | Types.ObjectId,
  payload: AddCartItemInput
) => {
  const cart = await getActiveCart(userId);
  const store = getSelectedStoreOrFail(cart.store);

  const variant = await getActiveVariantOrFail(payload.variant);
  const existingItem = await CartItemModel.findOne({
    cart: cart._id,
    variant: payload.variant
  });
  const nextQuantity = (existingItem?.quantity ?? 0) + payload.quantity;

  await assertAvailableStock(store, payload.variant, nextQuantity);

  if (existingItem) {
    existingItem.quantity = nextQuantity;
    existingItem.priceSnapshot = getPriceSnapshot(variant);
    await existingItem.save();
  } else {
    await CartItemModel.create({
      cart: cart._id,
      variant: payload.variant,
      quantity: payload.quantity,
      priceSnapshot: getPriceSnapshot(variant)
    });
  }

  return buildCartResponse(cart._id);
};

export const updateCartItem = async (
  userId: string | Types.ObjectId,
  itemId: string,
  payload: UpdateCartItemInput
) => {
  const cart = await getActiveCart(userId);
  const store = getSelectedStoreOrFail(cart.store);

  const item = await CartItemModel.findOne({ _id: itemId, cart: cart._id });

  if (!item) {
    throw new ApiError("Cart item not found", HTTP_STATUS.NOT_FOUND);
  }

  await getActiveVariantOrFail(String(item.variant));
  await assertAvailableStock(store, item.variant, payload.quantity);

  item.quantity = payload.quantity;
  await item.save();

  return buildCartResponse(cart._id);
};

export const deleteCartItem = async (userId: string | Types.ObjectId, itemId: string) => {
  const cart = await getActiveCart(userId);
  const item = await CartItemModel.findOneAndDelete({ _id: itemId, cart: cart._id });

  if (!item) {
    throw new ApiError("Cart item not found", HTTP_STATUS.NOT_FOUND);
  }

  return buildCartResponse(cart._id);
};

export const clearCart = async (userId: string | Types.ObjectId) => {
  const cart = await getActiveCart(userId);

  await CartItemModel.deleteMany({ cart: cart._id });

  return buildCartResponse(cart._id);
};

export const updateCartStore = async (
  userId: string | Types.ObjectId,
  payload: UpdateCartStoreInput
) => {
  const store = await StoreModel.findOne({
    _id: payload.store,
    status: STORE_STATUSES.ACTIVE
  });

  if (!store) {
    throw new ApiError("Store is not available", HTTP_STATUS.BAD_REQUEST);
  }

  const cart = await getActiveCart(userId);
  const shouldClearItems = cart.store && String(cart.store) !== payload.store;

  cart.store = store._id;
  await cart.save();

  if (shouldClearItems) {
    await CartItemModel.deleteMany({ cart: cart._id });
  }

  return buildCartResponse(cart._id);
};
