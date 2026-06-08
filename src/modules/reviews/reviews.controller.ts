import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as reviewService from "@/modules/reviews/reviews.service";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

const getUserId = (req: Request) => {
  if (!req.user) {
    throw new ApiError("Authentication is required", HTTP_STATUS.UNAUTHORIZED);
  }

  return req.user._id;
};

export const getProductReviews = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await reviewService.getProductReviews(String(req.params.slug));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Reviews fetched successfully"));
});

export const createReview = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await reviewService.createReview(
    getUserId(req),
    String(req.params.productId),
    req.body
  );

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Review created successfully"));
});

export const updateReviewStatus = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await reviewService.updateReviewStatus(String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Review status updated successfully"));
});
