import { Types } from "mongoose";

import { HTTP_STATUS } from "@/constants";
import {
  InventoryModel,
  STOCK_MOVEMENT_TYPES,
  StockMovementModel
} from "@/modules/inventories/inventories.model";
import {
  AdjustInventoryInput,
  ImportInventoryInput,
  InventoryListQuery,
  ReserveInventoryInput,
  StockMovementListQuery,
  UpdateInventoryInput,
  VariantInventoryQuery
} from "@/modules/inventories/inventories.validation";
import { ProductModel, ProductVariantModel } from "@/modules/products/products.model";
import { ApiError } from "@/utils/ApiError";

const LOW_STOCK_THRESHOLD = 5;

type PopulatedStore = {
  _id?: Types.ObjectId;
  name?: string;
};

type PopulatedProduct = {
  _id?: Types.ObjectId;
  name?: string;
  sku?: string;
};

type PopulatedVariant = {
  _id?: Types.ObjectId;
  name?: string;
  barcode?: string;
  product?: PopulatedProduct;
};

const toInventoryResponse = <T extends { quantity: number; reservedQuantity: number }>(
  inventory: T
) => ({
  ...inventory,
  availableQuantity: inventory.quantity - inventory.reservedQuantity
});

const getStockStatus = (availableQuantity: number) =>
  availableQuantity <= LOW_STOCK_THRESHOLD ? "LOW_STOCK" : "IN_STOCK";

const toInventoryTableResponse = <
  T extends {
    store?: PopulatedStore;
    variant?: PopulatedVariant;
    quantity: number;
    reservedQuantity: number;
  }
>(
  inventory: T
) => {
  const availableQuantity = inventory.quantity - inventory.reservedQuantity;
  const variant = inventory.variant;
  const product = variant?.product;

  return {
    ...inventory,
    productName: product?.name ?? "",
    productSku: product?.sku ?? "",
    variantName: variant?.name ?? "",
    barcode: variant?.barcode ?? "",
    storeName: inventory.store?.name ?? "",
    availableQuantity,
    stockStatus: getStockStatus(availableQuantity)
  };
};

const getSearchKeyword = (query: InventoryListQuery | StockMovementListQuery) =>
  query.keyword || query.search;

const getVariantIdsByKeyword = async (keyword?: string) => {
  if (!keyword) {
    return undefined;
  }

  const keywordRegex = new RegExp(keyword, "i");
  const products = await ProductModel.find({
    $or: [{ name: keywordRegex }, { sku: keywordRegex }]
  }).select("_id");

  const variants = await ProductVariantModel.find({
    $or: [
      { name: keywordRegex },
      { barcode: keywordRegex },
      { product: { $in: products.map((product) => product._id) } }
    ]
  }).select("_id");

  return variants.map((variant) => variant._id);
};

const getOrCreateInventory = async (store: string, variant: string) => {
  const inventory = await InventoryModel.findOne({ store, variant });

  if (inventory) {
    return inventory;
  }

  return InventoryModel.create({
    store,
    variant,
    quantity: 0,
    reservedQuantity: 0
  });
};

const createMovement = async (
  store: string | Types.ObjectId,
  variant: string | Types.ObjectId,
  type: keyof typeof STOCK_MOVEMENT_TYPES,
  quantity: number,
  reason?: string,
  createdBy?: Types.ObjectId
) =>
  StockMovementModel.create({
    store,
    variant,
    type: STOCK_MOVEMENT_TYPES[type],
    quantity,
    reason,
    createdBy
  });

export const getInventories = async (query: InventoryListQuery) => {
  const variantIds = await getVariantIdsByKeyword(getSearchKeyword(query));
  const inventories = await InventoryModel.find({
    ...(query.storeId ? { store: query.storeId } : {}),
    ...(query.variantId ? { variant: query.variantId } : {}),
    ...(variantIds ? { variant: { $in: variantIds } } : {})
  })
    .populate("store")
    .populate({
      path: "variant",
      populate: {
        path: "product",
        select: "name sku slug"
      }
    })
    .sort({ updatedAt: -1 })
    .lean();

  const inventoryRows = inventories.map(toInventoryTableResponse);

  if (query.lowStock) {
    return inventoryRows.filter((inventory) => inventory.stockStatus === "LOW_STOCK");
  }

  return inventoryRows;
};

export const getVariantInventory = async (
  variantId: string,
  query: VariantInventoryQuery
) => {
  const inventories = await InventoryModel.find({
    variant: variantId,
    ...(query.storeId ? { store: query.storeId } : {})
  })
    .populate("store")
    .populate("variant")
    .lean();

  return inventories.map(toInventoryResponse);
};

export const getStockMovements = async (query: StockMovementListQuery) => {
  const variantIds = await getVariantIdsByKeyword(getSearchKeyword(query));
  const movements = await StockMovementModel.find({
    ...(query.storeId ? { store: query.storeId } : {}),
    ...(query.variantId ? { variant: query.variantId } : {}),
    ...(query.type ? { type: query.type } : {}),
    ...(variantIds ? { variant: { $in: variantIds } } : {})
  })
    .populate("store")
    .populate({
      path: "variant",
      populate: {
        path: "product",
        select: "name sku slug"
      }
    })
    .populate("createdBy", "fullName email role")
    .sort({ createdAt: -1 })
    .lean();

  return movements.map((movement) => {
    const variant = movement.variant as PopulatedVariant | undefined;
    const product = variant?.product;
    const store = movement.store as PopulatedStore | undefined;

    return {
      ...movement,
      productName: product?.name ?? "",
      productSku: product?.sku ?? "",
      variantName: variant?.name ?? "",
      barcode: variant?.barcode ?? "",
      storeName: store?.name ?? ""
    };
  });
};

export const updateInventory = async (id: string, payload: UpdateInventoryInput) => {
  const inventory = await InventoryModel.findById(id);

  if (!inventory) {
    throw new ApiError("Inventory not found", HTTP_STATUS.NOT_FOUND);
  }

  const nextQuantity = payload.quantity ?? inventory.quantity;
  const nextReservedQuantity = payload.reservedQuantity ?? inventory.reservedQuantity;

  if (nextReservedQuantity > nextQuantity) {
    throw new ApiError("Reserved quantity cannot exceed quantity", HTTP_STATUS.BAD_REQUEST);
  }

  inventory.quantity = nextQuantity;
  inventory.reservedQuantity = nextReservedQuantity;
  await inventory.save();

  return toInventoryResponse(inventory.toObject());
};

export const importInventory = async (
  payload: ImportInventoryInput,
  createdBy?: Types.ObjectId
) => {
  const inventory = await getOrCreateInventory(payload.store, payload.variant);

  inventory.quantity += payload.quantity;
  await inventory.save();

  await createMovement(
    payload.store,
    payload.variant,
    "IMPORT",
    payload.quantity,
    payload.reason,
    createdBy
  );

  return toInventoryResponse(inventory.toObject());
};

export const adjustInventory = async (
  payload: AdjustInventoryInput,
  createdBy?: Types.ObjectId
) => {
  const inventory = await getOrCreateInventory(payload.store, payload.variant);
  const nextQuantity = inventory.quantity + payload.quantity;

  if (nextQuantity < inventory.reservedQuantity) {
    throw new ApiError("Quantity cannot be less than reserved quantity", HTTP_STATUS.BAD_REQUEST);
  }

  inventory.quantity = nextQuantity;
  await inventory.save();

  await createMovement(
    payload.store,
    payload.variant,
    "ADJUST",
    payload.quantity,
    payload.reason,
    createdBy
  );

  return toInventoryResponse(inventory.toObject());
};

export const reserveStock = async (
  payload: ReserveInventoryInput,
  createdBy?: Types.ObjectId
) => {
  const inventory = await getOrCreateInventory(payload.store, payload.variant);
  const availableQuantity = inventory.quantity - inventory.reservedQuantity;

  if (availableQuantity < payload.quantity) {
    throw new ApiError("Not enough stock to reserve", HTTP_STATUS.BAD_REQUEST);
  }

  inventory.reservedQuantity += payload.quantity;
  await inventory.save();

  await createMovement(
    payload.store,
    payload.variant,
    "RESERVE",
    payload.quantity,
    payload.reason,
    createdBy
  );

  return toInventoryResponse(inventory.toObject());
};

export const releaseStock = async (
  payload: ReserveInventoryInput,
  createdBy?: Types.ObjectId
) => {
  const inventory = await InventoryModel.findOne({
    store: payload.store,
    variant: payload.variant
  });

  if (!inventory) {
    throw new ApiError("Inventory not found", HTTP_STATUS.NOT_FOUND);
  }

  if (inventory.reservedQuantity < payload.quantity) {
    throw new ApiError("Release quantity exceeds reserved quantity", HTTP_STATUS.BAD_REQUEST);
  }

  inventory.reservedQuantity -= payload.quantity;
  await inventory.save();

  await createMovement(
    payload.store,
    payload.variant,
    "RELEASE",
    payload.quantity,
    payload.reason,
    createdBy
  );

  return toInventoryResponse(inventory.toObject());
};
