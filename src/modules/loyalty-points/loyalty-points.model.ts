import { model, Schema, Types } from "mongoose";

export const LOYALTY_POINT_TYPES = {
  EARN: "EARN",
  SPEND: "SPEND",
  REFUND: "REFUND",
  ADJUST: "ADJUST"
} as const;

export type LoyaltyPointType = (typeof LOYALTY_POINT_TYPES)[keyof typeof LOYALTY_POINT_TYPES];

export type LoyaltyPoint = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  order?: Types.ObjectId;
  points: number;
  type: LoyaltyPointType;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
};

const loyaltyPointSchema = new Schema<LoyaltyPoint>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order"
    },
    points: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: Object.values(LOYALTY_POINT_TYPES),
      required: true
    },
    note: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const LoyaltyPointModel = model<LoyaltyPoint>("LoyaltyPoint", loyaltyPointSchema);
