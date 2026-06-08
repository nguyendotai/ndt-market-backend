import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as bannerService from "@/modules/banners/banners.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getBanners = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const result = await bannerService.getPublicBanners();

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Banners fetched successfully"));
});

export const createBanner = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await bannerService.createBanner(req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Banner created successfully"));
});

export const updateBanner = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await bannerService.updateBanner(String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Banner updated successfully"));
});

export const deleteBanner = catchAsync(async (req: Request, res: Response): Promise<void> => {
  await bannerService.deleteBanner(String(req.params.id));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(null, "Banner deleted successfully"));
});
