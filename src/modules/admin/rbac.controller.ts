import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as rbacService from "@/modules/admin/rbac.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getRoles = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const result = await rbacService.getRoles();

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Roles fetched successfully"));
});

export const createRole = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await rbacService.createRole(req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Role created successfully"));
});

export const updateRole = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await rbacService.updateRole(String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Role updated successfully"));
});

export const deleteRole = catchAsync(async (req: Request, res: Response): Promise<void> => {
  await rbacService.deleteRole(String(req.params.id));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(null, "Role deleted successfully"));
});

export const getPermissions = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const result = await rbacService.getPermissions();

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Permissions fetched successfully"));
});

export const createPermission = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await rbacService.createPermission(req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Permission created successfully"));
});

export const assignRolePermissions = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await rbacService.assignRolePermissions(String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Role permissions assigned successfully"));
});

export const removeRolePermission = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  await rbacService.removeRolePermission(
    String(req.params.id),
    String(req.params.permissionId)
  );

  res.status(HTTP_STATUS.OK).json(new ApiResponse(null, "Role permission removed successfully"));
});
