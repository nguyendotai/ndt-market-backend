import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import { authService } from "@/modules/auth/auth.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import { catchAsync } from "@/utils/catchAsync";

export const register = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.register(req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Registered successfully"));
});

export const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.login(req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Logged in successfully"));
});

export const getMe = catchAsync(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError("Authentication is required", HTTP_STATUS.UNAUTHORIZED);
  }

  const result = await authService.getMe(req.user._id);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Current user fetched successfully"));
});

export const logout = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const result = authService.logout();

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Logged out successfully"));
});

export const changePassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError("Authentication is required", HTTP_STATUS.UNAUTHORIZED);
  }

  const result = await authService.changePassword(req.user._id, req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Password changed successfully"));
});

export const authController = {
  register,
  login,
  getMe,
  logout,
  changePassword
};
