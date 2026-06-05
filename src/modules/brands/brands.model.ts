import { model, Schema, Types } from "mongoose";

export type Brand = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const brandSchema = new Schema<Brand>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    logo: {
      type: String,
      default: null
    },
    description: {
      type: String,
      trim: true,
      default: ""
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

export const BrandModel = model<Brand>("Brand", brandSchema);
