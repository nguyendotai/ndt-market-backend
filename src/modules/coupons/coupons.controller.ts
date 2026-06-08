import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as couponService from "@/modules/coupons/coupons.service";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

const getUserId = (req: Request) => {
  if (!req.user) {
    throw new ApiError("Authentication is required", HTTP_STATUS.UNAUTHORIZED);
  }

  return req.user._id;
};

export const applyCoupon = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await couponService.applyCoupon(getUserId(req), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Coupon applied successfully"));
});

export const getCoupons = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const result = await couponService.getCoupons();

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Coupons fetched successfully"));
});

export const createCoupon = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await couponService.createCoupon(req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Coupon created successfully"));
});

export const updateCoupon = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await couponService.updateCoupon(String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Coupon updated successfully"));
});

export const deleteCoupon = catchAsync(async (req: Request, res: Response): Promise<void> => {
  await couponService.deleteCoupon(String(req.params.id));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(null, "Coupon deleted successfully"));
});
