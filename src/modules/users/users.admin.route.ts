import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import {
  getAdminUserById,
  getAdminUsers,
  updateUserRole,
  updateUserStatus
} from "@/modules/users/users.controller";
import {
  adminUserListQuerySchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  userIdSchema
} from "@/modules/users/users.validation";

export const adminUsersRoute = Router();

adminUsersRoute.get("/", validate(adminUserListQuerySchema), getAdminUsers);
adminUsersRoute.get("/:id", validate(userIdSchema), getAdminUserById);
adminUsersRoute.patch("/:id/status", validate(updateUserStatusSchema), updateUserStatus);
adminUsersRoute.patch("/:id/role", validate(updateUserRoleSchema), updateUserRole);
