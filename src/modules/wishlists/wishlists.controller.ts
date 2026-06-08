import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as wishlistService from "@/modules/wishlists/wishlists.service";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

const getUserId = (req: Request) => {
  if (!req.user) {
    throw new ApiError("Authentication is required", HTTP_STATUS.UNAUTHORIZED);
  }

  return req.user._id;
};

export const getWishlist = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await wishlistService.getWishlist(getUserId(req));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Wishlist fetched successfully"));
});

export const addWishlistProduct = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await wishlistService.addWishlistProduct(
    getUserId(req),
    String(req.params.productId)
  );

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Wishlist product added successfully"));
});

export const removeWishlistProduct = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  await wishlistService.removeWishlistProduct(getUserId(req), String(req.params.productId));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(null, "Wishlist product removed successfully"));
});
