import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { env } from "@/configs/env";
import { HTTP_STATUS, ROLES, Role } from "@/constants";
import { getPermissionKeysByRoleName } from "@/modules/admin/rbac.service";
import { UserModel, USER_STATUSES } from "@/modules/users/users.model";
import { ApiError } from "@/utils/ApiError";

type AccessTokenPayload = JwtPayload & {
  userId?: string;
  role?: Role;
};

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    next(new ApiError("Authentication token is required", HTTP_STATUS.UNAUTHORIZED));
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;

    if (!decoded.userId) {
      next(new ApiError("Invalid authentication token payload", HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    const user = await UserModel.findById(decoded.userId);

    if (!user || user.status !== USER_STATUSES.ACTIVE) {
      next(new ApiError("User is not allowed to access this resource", HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    req.user = user.toObject();
    next();
  } catch {
    next(new ApiError("Invalid or expired authentication token", HTTP_STATUS.UNAUTHORIZED));
  }
};

export const authorizeRoles =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError("Authentication is required", HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new ApiError("You do not have permission to access this resource", HTTP_STATUS.FORBIDDEN));
      return;
    }

    next();
  };

export const authorizePermissions =
  (...permissions: string[]) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      next(new ApiError("Authentication is required", HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    if (req.user.role === ROLES.SUPER_ADMIN) {
      next();
      return;
    }

    const userPermissions = req.user.permissions ?? [];
    const rolePermissions = await getPermissionKeysByRoleName(req.user.role);
    const permissionSet = new Set([...userPermissions, ...rolePermissions]);
    const hasPermission = permissions.every((permission) => permissionSet.has(permission));

    if (!hasPermission) {
      next(new ApiError("You do not have permission to access this resource", HTTP_STATUS.FORBIDDEN));
      return;
    }

    next();
  };
