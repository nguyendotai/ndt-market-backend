import { model, Schema, Types } from "mongoose";

import { ORDER_STATUS, OrderStatus, PAYMENT_STATUS, PaymentStatus } from "@/constants";

export const DELIVERY_TYPES = {
  DELIVERY: "DELIVERY",
  PICKUP: "PICKUP"
} as const;

export type DeliveryType = (typeof DELIVERY_TYPES)[keyof typeof DELIVERY_TYPES];

export type OrderAddress = {
  receiverName?: string;
  phone?: string;
  province?: string;
  district?: string;
  ward?: string;
  addressDetail?: string;
  latitude?: number;
  longitude?: number;
};

export type Order = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  store: Types.ObjectId;
  orderCode: string;
  status: OrderStatus;
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  total: number;
  paymentStatus: PaymentStatus;
  deliveryType: DeliveryType;
  address?: OrderAddress;
  timeSlot?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderItem = {
  _id: Types.ObjectId;
  order: Types.ObjectId;
  variant: Types.ObjectId;
  productName: string;
  variantName: string;
  quantity: number;
  price: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderStatusHistory = {
  _id: Types.ObjectId;
  order: Types.ObjectId;
  status: OrderStatus;
  note?: string;
  changedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const orderAddressSchema = new Schema<OrderAddress>(
  {
    receiverName: { type: String, trim: true },
    phone: { type: String, trim: true },
    province: { type: String, trim: true },
    district: { type: String, trim: true },
    ward: { type: String, trim: true },
    addressDetail: { type: String, trim: true },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 }
  },
  { _id: false }
);

const orderSchema = new Schema<Order>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true
    },
    orderCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      index: true
    },
    subtotal: { type: Number, required: true, min: 0 },
    discountTotal: { type: Number, default: 0, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
      index: true
    },
    deliveryType: {
      type: String,
      enum: Object.values(DELIVERY_TYPES),
      required: true
    },
    address: {
      type: orderAddressSchema
    },
    timeSlot: {
      type: String,
      trim: true,
      default: ""
    },
    note: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const orderItemSchema = new Schema<OrderItem>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true
    },
    productName: {
      type: String,
      required: true,
      trim: true
    },
    variantName: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const orderStatusHistorySchema = new Schema<OrderStatusHistory>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      required: true
    },
    note: {
      type: String,
      trim: true,
      default: ""
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const OrderModel = model<Order>("Order", orderSchema);
export const OrderItemModel = model<OrderItem>("OrderItem", orderItemSchema);
export const OrderStatusHistoryModel = model<OrderStatusHistory>(
  "OrderStatusHistory",
  orderStatusHistorySchema
);
