import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as inventoryService from "@/modules/inventories/inventories.service";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

const getAdminUserId = (req: Request) => {
  if (!req.user) {
    throw new ApiError("Authentication is required", HTTP_STATUS.UNAUTHORIZED);
  }

  return req.user._id;
};

export const getInventories = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await inventoryService.getInventories(req.query as never);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Inventories fetched successfully"));
});

export const getVariantInventory = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await inventoryService.getVariantInventory(
    String(req.params.variantId),
    req.query as never
  );

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Inventory fetched successfully"));
});

export const updateInventory = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await inventoryService.updateInventory(String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Inventory updated successfully"));
});

export const importInventory = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await inventoryService.importInventory(req.body, getAdminUserId(req));

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Inventory imported successfully"));
});

export const adjustInventory = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await inventoryService.adjustInventory(req.body, getAdminUserId(req));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Inventory adjusted successfully"));
});

export const reserveStock = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await inventoryService.reserveStock(req.body, getAdminUserId(req));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Stock reserved successfully"));
});

export const releaseStock = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await inventoryService.releaseStock(req.body, getAdminUserId(req));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Stock released successfully"));
});
