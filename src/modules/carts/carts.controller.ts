import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as cartService from "@/modules/carts/carts.service";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

const getUserId = (req: Request) => {
  if (!req.user) {
    throw new ApiError("Authentication is required", HTTP_STATUS.UNAUTHORIZED);
  }

  return req.user._id;
};

export const getCart = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await cartService.getMyCart(getUserId(req));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Cart fetched successfully"));
});

export const addCartItem = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await cartService.addCartItem(getUserId(req), req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Cart item added successfully"));
});

export const updateCartItem = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await cartService.updateCartItem(
    getUserId(req),
    String(req.params.itemId),
    req.body
  );

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Cart item updated successfully"));
});

export const deleteCartItem = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await cartService.deleteCartItem(getUserId(req), String(req.params.itemId));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Cart item deleted successfully"));
});

export const clearCart = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await cartService.clearCart(getUserId(req));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Cart cleared successfully"));
});

export const updateCartStore = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await cartService.updateCartStore(getUserId(req), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Cart store updated successfully"));
});
