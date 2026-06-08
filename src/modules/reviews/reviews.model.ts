import { model, Schema, Types } from "mongoose";

export const REVIEW_STATUSES = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
} as const;

export type ReviewStatus = (typeof REVIEW_STATUSES)[keyof typeof REVIEW_STATUSES];

export type Review = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  product: Types.ObjectId;
  order: Types.ObjectId;
  rating: number;
  comment?: string;
  images: string[];
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
};

const reviewSchema = new Schema<Review>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true,
      default: ""
    },
    images: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: Object.values(REVIEW_STATUSES),
      default: REVIEW_STATUSES.PENDING,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

reviewSchema.index({ user: 1, product: 1, order: 1 }, { unique: true });

export const ReviewModel = model<Review>("Review", reviewSchema);
