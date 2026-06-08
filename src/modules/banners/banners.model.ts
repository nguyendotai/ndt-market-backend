import { model, Schema, Types } from "mongoose";

export const BANNER_POSITIONS = {
  HOME_TOP: "HOME_TOP",
  HOME_MIDDLE: "HOME_MIDDLE",
  CATEGORY: "CATEGORY",
  POPUP: "POPUP"
} as const;

export const BANNER_STATUSES = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE"
} as const;

export type BannerPosition = (typeof BANNER_POSITIONS)[keyof typeof BANNER_POSITIONS];
export type BannerStatus = (typeof BANNER_STATUSES)[keyof typeof BANNER_STATUSES];

export type Banner = {
  _id: Types.ObjectId;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  position: BannerPosition;
  startDate: Date;
  endDate: Date;
  status: BannerStatus;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

const bannerSchema = new Schema<Banner>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    linkUrl: {
      type: String,
      trim: true,
      default: ""
    },
    position: {
      type: String,
      enum: Object.values(BANNER_POSITIONS),
      required: true,
      index: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(BANNER_STATUSES),
      default: BANNER_STATUSES.ACTIVE,
      index: true
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const BannerModel = model<Banner>("Banner", bannerSchema);
