import { model, Schema, Types } from "mongoose";

export type UserAddress = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  receiverName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const userAddressSchema = new Schema<UserAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    receiverName: {
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
    addressDetail: {
      type: String,
      required: true,
      trim: true
    },
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const UserAddressModel = model<UserAddress>("UserAddress", userAddressSchema);
