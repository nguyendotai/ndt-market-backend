import { model, Schema, Types } from "mongoose";

export type Wishlist = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  product: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const wishlistSchema = new Schema<Wishlist>(
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
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

export const WishlistModel = model<Wishlist>("Wishlist", wishlistSchema);
