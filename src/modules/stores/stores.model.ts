import { model, Schema, Types } from "mongoose";

export const STORE_STATUSES = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE"
} as const;

export type StoreStatus = (typeof STORE_STATUSES)[keyof typeof STORE_STATUSES];

export type Store = {
  _id: Types.ObjectId;
  name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string;
  status: StoreStatus;
  createdAt: Date;
  updatedAt: Date;
};

const storeSchema = new Schema<Store>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    province: {
      type: String,
      required: true,
      trim: true
    },
    district: {
      type: String,
      required: true,
      trim: true
    },
    ward: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    },
    openingHours: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: Object.values(STORE_STATUSES),
      default: STORE_STATUSES.ACTIVE,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const StoreModel = model<Store>("Store", storeSchema);
