import { model, Schema, Types } from "mongoose";

import { DISCOUNT_TYPES, DiscountType, PROMOTION_STATUSES, PromotionStatus } from "@/modules/promotions/promotions.model";

export type Coupon = {
  _id: Types.ObjectId;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  userLimit: number;
  expiredAt: Date;
  status: PromotionStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CouponUsage = {
  _id: Types.ObjectId;
  coupon: Types.ObjectId;
  user: Types.ObjectId;
  order?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const couponSchema = new Schema<Coupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    discountType: {
      type: String,
      enum: Object.values(DISCOUNT_TYPES),
      required: true
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0
    },
    minOrderValue: {
      type: Number,
      default: 0,
      min: 0
    },
    maxDiscount: {
      type: Number,
      min: 0
    },
    usageLimit: {
      type: Number,
      min: 1
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0
    },
    userLimit: {
      type: Number,
      default: 1,
      min: 1
    },
    expiredAt: {
      type: Date,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: Object.values(PROMOTION_STATUSES),
      default: PROMOTION_STATUSES.ACTIVE,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const couponUsageSchema = new Schema<CouponUsage>(
  {
    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
      index: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const CouponModel = model<Coupon>("Coupon", couponSchema);
export const CouponUsageModel = model<CouponUsage>("CouponUsage", couponUsageSchema);
