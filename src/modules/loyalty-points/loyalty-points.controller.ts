import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as loyaltyPointService from "@/modules/loyalty-points/loyalty-points.service";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getMyLoyaltyPoints = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError("Authentication is required", HTTP_STATUS.UNAUTHORIZED);
  }

  const result = await loyaltyPointService.getMyLoyaltyPoints(req.user._id);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Loyalty points fetched successfully"));
});

export const getAllLoyaltyPoints = catchAsync(async (req: Request, res: Response) => {
  const result = await loyaltyPointService.getAllLoyaltyPoints({
    user: req.query.userId as string | undefined,
    type: req.query.type as never
  });

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Loyalty points fetched successfully"));
});

export const adjustLoyaltyPoints = catchAsync(async (req: Request, res: Response) => {
  const result = await loyaltyPointService.adjustLoyaltyPoints(req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Loyalty points adjusted successfully"));
});
