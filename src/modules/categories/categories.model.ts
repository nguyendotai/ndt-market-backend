import { model, Schema, Types } from "mongoose";

export type Category = {
  _id: Types.ObjectId;
  parent?: Types.ObjectId | null;
  name: string;
  slug: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const categorySchema = new Schema<Category>(
  {
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true
    },
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
    image: {
      type: String,
      default: null
    },
    sortOrder: {
      type: Number,
      default: 0
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

export const CategoryModel = model<Category>("Category", categorySchema);
