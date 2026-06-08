import { model, Schema, Types } from "mongoose";

export const PROMOTION_TYPES = {
  PRODUCT_DISCOUNT: "PRODUCT_DISCOUNT",
  ORDER_DISCOUNT: "ORDER_DISCOUNT",
  BUY_X_GET_Y: "BUY_X_GET_Y"
} as const;

export const DISCOUNT_TYPES = {
  PERCENT: "PERCENT",
  FIXED: "FIXED"
} as const;

export const PROMOTION_STATUSES = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE"
} as const;

export type PromotionType = (typeof PROMOTION_TYPES)[keyof typeof PROMOTION_TYPES];
export type DiscountType = (typeof DISCOUNT_TYPES)[keyof typeof DISCOUNT_TYPES];
export type PromotionStatus = (typeof PROMOTION_STATUSES)[keyof typeof PROMOTION_STATUSES];

export type Promotion = {
  _id: Types.ObjectId;
  name: string;
  type: PromotionType;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: Date;
  endDate: Date;
  status: PromotionStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type PromotionProduct = {
  _id: Types.ObjectId;
  promotion: Types.ObjectId;
  variant: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const promotionSchema = new Schema<Promotion>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: Object.values(PROMOTION_TYPES),
      required: true
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
    startDate: {
      type: Date,
      required: true,
      index: true
    },
    endDate: {
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

const promotionProductSchema = new Schema<PromotionProduct>(
  {
    promotion: {
      type: Schema.Types.ObjectId,
      ref: "Promotion",
      required: true,
      index: true
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

promotionProductSchema.index({ promotion: 1, variant: 1 }, { unique: true });

export const PromotionModel = model<Promotion>("Promotion", promotionSchema);
export const PromotionProductModel = model<PromotionProduct>(
  "PromotionProduct",
  promotionProductSchema
);
