import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as brandService from "@/modules/brands/brands.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getBrands = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const result = await brandService.getPublicBrands();

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Brands fetched successfully"));
});

export const getBrandBySlug = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await brandService.getPublicBrandBySlug(String(req.params.slug));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Brand fetched successfully"));
});

export const createBrand = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await brandService.createBrand(req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Brand created successfully"));
});

export const updateBrand = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await brandService.updateBrand(String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Brand updated successfully"));
});

export const deleteBrand = catchAsync(async (req: Request, res: Response): Promise<void> => {
  await brandService.deleteBrand(String(req.params.id));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(null, "Brand deleted successfully"));
});
