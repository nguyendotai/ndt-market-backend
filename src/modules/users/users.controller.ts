import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as userService from "@/modules/users/users.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getUsers = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  res.status(HTTP_STATUS.OK).json(new ApiResponse(userService.getUsersOverview(), "Users module ready"));
});

export const getAdminUsers = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await userService.getAdminUsers(req.query as never);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(result.users, "Users fetched successfully", result.meta));
});

export const getAdminUserById = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await userService.getAdminUserById(String(req.params.id));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "User fetched successfully"));
});

export const updateUserStatus = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await userService.updateUserStatus(String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "User status updated successfully"));
});

export const updateUserRole = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await userService.updateUserRole(String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "User role updated successfully"));
});
