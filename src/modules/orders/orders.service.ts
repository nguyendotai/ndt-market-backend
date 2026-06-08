import { FilterQuery, Types } from "mongoose";

import { HTTP_STATUS, ORDER_STATUS, OrderStatus, PAYMENT_STATUS } from "@/constants";
import { CartItemModel, CartModel } from "@/modules/carts/carts.model";
import { releaseStock, reserveStock } from "@/modules/inventories/inventories.service";
import {
  Order,
  OrderItemModel,
  OrderModel,
  OrderStatusHistoryModel
} from "@/modules/orders/orders.model";
import {
  AdminOrderListQuery,
  CancelOrderInput,
  CheckoutInput,
  UpdateOrderStatusInput
} from "@/modules/orders/orders.validation";
import {
  PRODUCT_STATUSES,
  PRODUCT_VARIANT_STATUSES,
  ProductModel,
  ProductVariantModel
} from "@/modules/products/products.model";
import { ApiError } from "@/utils/ApiError";

type ReservedItem = {
  store: Types.ObjectId;
  variant: Types.ObjectId;
  quantity: number;
};

const cancellableStatuses: OrderStatus[] = [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED];

const generateOrderCode = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const prefix = `ORD${year}${month}${day}`;
  const count = await OrderModel.countDocuments({
    orderCode: new RegExp(`^${prefix}`)
  });

  return `${prefix}${String(count + 1).padStart(4, "0")}`;
};

const createStatusHistory = (
  order: Types.ObjectId,
  status: OrderStatus,
  note?: string,
  changedBy?: Types.ObjectId
) =>
  OrderStatusHistoryModel.create({
    order,
    status,
    note,
    changedBy
  });

const populateOrder = async (orderId: string | Types.ObjectId) => {
  const order = await OrderModel.findById(orderId).populate("user").populate("store").lean();

  if (!order) {
    throw new ApiError("Order not found", HTTP_STATUS.NOT_FOUND);
  }

  const [items, histories] = await Promise.all([
    OrderItemModel.find({ order: order._id }).populate("variant").lean(),
    OrderStatusHistoryModel.find({ order: order._id })
      .populate("changedBy")
      .sort({ createdAt: 1 })
      .lean()
  ]);

  return {
    ...order,
    items,
    histories
  };
};

const releaseOrderStock = async (order: Order, changedBy?: Types.ObjectId, note?: string) => {
  const orderItems = await OrderItemModel.find({ order: order._id });

  await Promise.all(
    orderItems.map((item) =>
      releaseStock(
        {
          store: String(order.store),
          variant: String(item.variant),
          quantity: item.quantity,
          reason: note ?? `Release stock for order ${order.orderCode}`
        },
        changedBy
      )
    )
  );
};

export const checkout = async (userId: string | Types.ObjectId, payload: CheckoutInput) => {
  const cart = await CartModel.findOne({ user: userId });

  if (!cart || !cart.store) {
    throw new ApiError("Cart store is required before checkout", HTTP_STATUS.BAD_REQUEST);
  }

  const cartItems = await CartItemModel.find({ cart: cart._id });

  if (cartItems.length === 0) {
    throw new ApiError("Cart is empty", HTTP_STATUS.BAD_REQUEST);
  }

  const reservedItems: ReservedItem[] = [];

  try {
    const orderItemsPayload = [];
    let subtotal = 0;

    for (const cartItem of cartItems) {
      const variant = await ProductVariantModel.findOne({
        _id: cartItem.variant,
        status: PRODUCT_VARIANT_STATUSES.ACTIVE
      });

      if (!variant) {
        throw new ApiError("Product variant is not available", HTTP_STATUS.BAD_REQUEST);
      }

      const product = await ProductModel.findOne({
        _id: variant.product,
        status: PRODUCT_STATUSES.ACTIVE
      });

      if (!product) {
        throw new ApiError("Product is not available", HTTP_STATUS.BAD_REQUEST);
      }

      await reserveStock(
        {
          store: String(cart.store),
          variant: String(cartItem.variant),
          quantity: cartItem.quantity,
          reason: "Reserve stock for checkout"
        },
        cart.user
      );

      reservedItems.push({
        store: cart.store,
        variant: cartItem.variant,
        quantity: cartItem.quantity
      });

      const itemTotal = cartItem.priceSnapshot * cartItem.quantity;
      subtotal += itemTotal;
      orderItemsPayload.push({
        variant: cartItem.variant,
        productName: product.name,
        variantName: variant.name,
        quantity: cartItem.quantity,
        price: cartItem.priceSnapshot,
        total: itemTotal
      });
    }

    const discountTotal = payload.discountTotal;
    const shippingFee = payload.shippingFee;
    const total = Math.max(subtotal - discountTotal + shippingFee, 0);
    const order = await OrderModel.create({
      user: userId,
      store: cart.store,
      orderCode: await generateOrderCode(),
      status: ORDER_STATUS.PENDING,
      subtotal,
      discountTotal,
      shippingFee,
      total,
      paymentStatus: PAYMENT_STATUS.PENDING,
      deliveryType: payload.deliveryType,
      address: payload.address,
      timeSlot: payload.timeSlot,
      note: payload.note
    });

    await OrderItemModel.insertMany(
      orderItemsPayload.map((item) => ({
        ...item,
        order: order._id
      }))
    );
    await createStatusHistory(order._id, ORDER_STATUS.PENDING, "Order created", cart.user);
    await CartItemModel.deleteMany({ cart: cart._id });

    return populateOrder(order._id);
  } catch (error) {
    await Promise.all(
      reservedItems.map((item) =>
        releaseStock(
          {
            store: String(item.store),
            variant: String(item.variant),
            quantity: item.quantity,
            reason: "Rollback checkout stock reservation"
          },
          cart.user
        )
      )
    );

    throw error;
  }
};

export const getMyOrders = (userId: string | Types.ObjectId) =>
  OrderModel.find({ user: userId }).sort({ createdAt: -1 });

export const getMyOrderByCode = async (
  userId: string | Types.ObjectId,
  orderCode: string
) => {
  const order = await OrderModel.findOne({ user: userId, orderCode });

  if (!order) {
    throw new ApiError("Order not found", HTTP_STATUS.NOT_FOUND);
  }

  return populateOrder(order._id);
};

export const cancelMyOrder = async (
  userId: string | Types.ObjectId,
  orderCode: string,
  payload: CancelOrderInput
) => {
  const order = await OrderModel.findOne({ user: userId, orderCode });

  if (!order) {
    throw new ApiError("Order not found", HTTP_STATUS.NOT_FOUND);
  }

  if (!cancellableStatuses.includes(order.status)) {
    throw new ApiError("Order cannot be cancelled", HTTP_STATUS.BAD_REQUEST);
  }

  await releaseOrderStock(order, order.user, payload.note ?? "Customer cancelled order");
  order.status = ORDER_STATUS.CANCELLED;
  await order.save();
  await createStatusHistory(
    order._id,
    ORDER_STATUS.CANCELLED,
    payload.note ?? "Customer cancelled order",
    order.user
  );

  return populateOrder(order._id);
};

export const getAdminOrders = (query: AdminOrderListQuery) => {
  const orderQuery: FilterQuery<Order> = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.paymentStatus ? { paymentStatus: query.paymentStatus } : {}),
    ...(query.userId ? { user: query.userId } : {}),
    ...(query.storeId ? { store: query.storeId } : {})
  };

  return OrderModel.find(orderQuery)
    .populate("user")
    .populate("store")
    .sort({ createdAt: -1 });
};

export const getAdminOrderById = async (id: string) => populateOrder(id);

export const updateOrderStatus = async (
  id: string,
  payload: UpdateOrderStatusInput,
  changedBy?: Types.ObjectId
) => {
  const order = await OrderModel.findById(id);

  if (!order) {
    throw new ApiError("Order not found", HTTP_STATUS.NOT_FOUND);
  }

  const previousStatus = order.status;

  if (
    payload.status === ORDER_STATUS.CANCELLED &&
    previousStatus !== ORDER_STATUS.CANCELLED &&
    previousStatus !== ORDER_STATUS.REFUNDED
  ) {
    await releaseOrderStock(order, changedBy, payload.note ?? "Admin cancelled order");
  }

  order.status = payload.status;
  await order.save();
  await createStatusHistory(order._id, payload.status, payload.note, changedBy);

  return populateOrder(order._id);
};
