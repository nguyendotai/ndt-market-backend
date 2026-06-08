import { model, Schema, Types } from "mongoose";

import { OrderAddress } from "@/modules/orders/orders.model";

export const SHIPMENT_STATUSES = {
  PENDING: "PENDING",
  ASSIGNED: "ASSIGNED",
  PICKED_UP: "PICKED_UP",
  DELIVERING: "DELIVERING",
  DELIVERED: "DELIVERED",
  FAILED: "FAILED"
} as const;

export const SHIPPER_STATUSES = {
  AVAILABLE: "AVAILABLE",
  BUSY: "BUSY",
  OFFLINE: "OFFLINE"
} as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[keyof typeof SHIPMENT_STATUSES];
export type ShipperStatus = (typeof SHIPPER_STATUSES)[keyof typeof SHIPPER_STATUSES];

export type DeliveryTimeSlot = {
  _id: Types.ObjectId;
  store: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  maxOrders: number;
  currentOrders: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Shipment = {
  _id: Types.ObjectId;
  order: Types.ObjectId;
  shipper?: Types.ObjectId;
  address?: OrderAddress;
  timeSlot?: Types.ObjectId;
  shippingPartner?: string;
  trackingCode?: string;
  status: ShipmentStatus;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Shipper = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  vehicleType?: string;
  status: ShipperStatus;
  createdAt: Date;
  updatedAt: Date;
};

const addressSchema = new Schema<OrderAddress>(
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

const deliveryTimeSlotSchema = new Schema<DeliveryTimeSlot>(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true
    },
    startTime: {
      type: Date,
      required: true,
      index: true
    },
    endTime: {
      type: Date,
      required: true
    },
    maxOrders: {
      type: Number,
      required: true,
      min: 1
    },
    currentOrders: {
      type: Number,
      default: 0,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const shipmentSchema = new Schema<Shipment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
      index: true
    },
    shipper: {
      type: Schema.Types.ObjectId,
      ref: "Shipper",
      index: true
    },
    address: {
      type: addressSchema
    },
    timeSlot: {
      type: Schema.Types.ObjectId,
      ref: "DeliveryTimeSlot"
    },
    shippingPartner: {
      type: String,
      trim: true,
      default: ""
    },
    trackingCode: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: Object.values(SHIPMENT_STATUSES),
      default: SHIPMENT_STATUSES.PENDING,
      index: true
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

const shipperSchema = new Schema<Shipper>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    vehicleType: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: Object.values(SHIPPER_STATUSES),
      default: SHIPPER_STATUSES.AVAILABLE,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const DeliveryTimeSlotModel = model<DeliveryTimeSlot>(
  "DeliveryTimeSlot",
  deliveryTimeSlotSchema
);
export const ShipmentModel = model<Shipment>("Shipment", shipmentSchema);
export const ShipperModel = model<Shipper>("Shipper", shipperSchema);
