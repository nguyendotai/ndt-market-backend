import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as promotionService from "@/modules/promotions/promotions.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getPromotions = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const result = await promotionService.getPublicPromotions();

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Promotions fetched successfully"));
});

export const createPromotion = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await promotionService.createPromotion(req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Promotion created successfully"));
});

export const updatePromotion = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await promotionService.updatePromotion(String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Promotion updated successfully"));
});

export const deletePromotion = catchAsync(async (req: Request, res: Response): Promise<void> => {
  await promotionService.deletePromotion(String(req.params.id));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(null, "Promotion deleted successfully"));
});
