import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as storeService from "@/modules/stores/stores.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getStores = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const result = await storeService.getPublicStores();

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Stores fetched successfully"));
});

export const getNearbyStores = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await storeService.getNearbyStores(req.query as never);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Nearby stores fetched successfully"));
});

export const createStore = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await storeService.createStore(req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Store created successfully"));
});

export const updateStore = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await storeService.updateStore(String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Store updated successfully"));
});

export const deleteStore = catchAsync(async (req: Request, res: Response): Promise<void> => {
  await storeService.deleteStore(String(req.params.id));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(null, "Store deleted successfully"));
});
