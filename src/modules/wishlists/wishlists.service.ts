import { Types } from "mongoose";

import { HTTP_STATUS } from "@/constants";
import { ProductModel } from "@/modules/products/products.model";
import { WishlistModel } from "@/modules/wishlists/wishlists.model";
import { ApiError } from "@/utils/ApiError";

export const getWishlist = (userId: string | Types.ObjectId) =>
  WishlistModel.find({ user: userId })
    .populate({
      path: "product",
      populate: [{ path: "category" }, { path: "brand" }]
    })
    .sort({ createdAt: -1 });

export const addWishlistProduct = async (
  userId: string | Types.ObjectId,
  productId: string
) => {
  const product = await ProductModel.findById(productId);

  if (!product) {
    throw new ApiError("Product not found", HTTP_STATUS.NOT_FOUND);
  }

  const existingItem = await WishlistModel.findOne({ user: userId, product: productId });

  if (existingItem) {
    return existingItem.populate("product");
  }

  return WishlistModel.create({
    user: userId,
    product: productId
  });
};

export const removeWishlistProduct = async (
  userId: string | Types.ObjectId,
  productId: string
) => {
  const item = await WishlistModel.findOneAndDelete({ user: userId, product: productId });

  if (!item) {
    throw new ApiError("Wishlist item not found", HTTP_STATUS.NOT_FOUND);
  }

  return item;
};
