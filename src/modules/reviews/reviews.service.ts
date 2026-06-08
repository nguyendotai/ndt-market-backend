import { Types } from "mongoose";

import { HTTP_STATUS, ORDER_STATUS } from "@/constants";
import { OrderItemModel, OrderModel } from "@/modules/orders/orders.model";
import { ProductModel, ProductVariantModel } from "@/modules/products/products.model";
import { REVIEW_STATUSES, ReviewModel } from "@/modules/reviews/reviews.model";
import {
  CreateReviewInput,
  UpdateReviewStatusInput
} from "@/modules/reviews/reviews.validation";
import { ApiError } from "@/utils/ApiError";

const recalculateProductRating = async (productId: string | Types.ObjectId) => {
  const result = await ReviewModel.aggregate([
    {
      $match: {
        product: new Types.ObjectId(String(productId)),
        status: REVIEW_STATUSES.APPROVED
      }
    },
    {
      $group: {
        _id: "$product",
        ratingAverage: { $avg: "$rating" },
        ratingCount: { $sum: 1 }
      }
    }
  ]);

  const rating = result[0];

  await ProductModel.findByIdAndUpdate(productId, {
    ratingAverage: rating ? Number(rating.ratingAverage.toFixed(1)) : 0,
    ratingCount: rating?.ratingCount ?? 0
  });
};

export const getProductReviews = async (slug: string) => {
  const product = await ProductModel.findOne({ slug });

  if (!product) {
    throw new ApiError("Product not found", HTTP_STATUS.NOT_FOUND);
  }

  return ReviewModel.find({
    product: product._id,
    status: REVIEW_STATUSES.APPROVED
  })
    .populate("user")
    .sort({ createdAt: -1 });
};

export const createReview = async (
  userId: string | Types.ObjectId,
  productId: string,
  payload: CreateReviewInput
) => {
  const order = await OrderModel.findOne({
    _id: payload.order,
    user: userId,
    status: ORDER_STATUS.COMPLETED
  });

  if (!order) {
    throw new ApiError("Only completed purchased products can be reviewed", HTTP_STATUS.BAD_REQUEST);
  }

  const variants = await ProductVariantModel.find({ product: productId }).select("_id");
  const orderItem = await OrderItemModel.findOne({
    order: order._id,
    variant: { $in: variants.map((variant) => variant._id) }
  });

  if (!orderItem) {
    throw new ApiError("Product was not purchased in this order", HTTP_STATUS.BAD_REQUEST);
  }

  const existingReview = await ReviewModel.findOne({
    user: userId,
    product: productId,
    order: order._id
  });

  if (existingReview) {
    throw new ApiError("Product already reviewed for this order", HTTP_STATUS.CONFLICT);
  }

  return ReviewModel.create({
    user: userId,
    product: productId,
    order: order._id,
    rating: payload.rating,
    comment: payload.comment,
    images: payload.images,
    status: REVIEW_STATUSES.PENDING
  });
};

export const updateReviewStatus = async (id: string, payload: UpdateReviewStatusInput) => {
  const review = await ReviewModel.findByIdAndUpdate(id, payload, { new: true });

  if (!review) {
    throw new ApiError("Review not found", HTTP_STATUS.NOT_FOUND);
  }

  if (payload.status === REVIEW_STATUSES.APPROVED) {
    await recalculateProductRating(review.product);
  }

  if (payload.status === REVIEW_STATUSES.REJECTED) {
    await recalculateProductRating(review.product);
  }

  return review;
};
