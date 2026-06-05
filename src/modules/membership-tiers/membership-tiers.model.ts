import { model, Schema, Types } from "mongoose";

export const MEMBERSHIP_TIER_STATUSES = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE"
} as const;

export type MembershipTierStatus =
  (typeof MEMBERSHIP_TIER_STATUSES)[keyof typeof MEMBERSHIP_TIER_STATUSES];

export type MembershipTier = {
  _id: Types.ObjectId;
  name: string;
  minPoint: number;
  discountPercent: number;
  benefits: string[];
  status: MembershipTierStatus;
  createdAt: Date;
  updatedAt: Date;
};

const membershipTierSchema = new Schema<MembershipTier>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    minPoint: {
      type: Number,
      required: true,
      min: 0
    },
    discountPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    benefits: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: Object.values(MEMBERSHIP_TIER_STATUSES),
      default: MEMBERSHIP_TIER_STATUSES.ACTIVE
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const MembershipTierModel = model<MembershipTier>(
  "MembershipTier",
  membershipTierSchema
);
