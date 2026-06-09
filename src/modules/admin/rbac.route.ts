import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import {
  assignRolePermissions,
  createPermission,
  createRole,
  deleteRole,
  getPermissions,
  getRoles,
  removeRolePermission,
  updateRole
} from "@/modules/admin/rbac.controller";
import {
  assignRolePermissionsSchema,
  createPermissionSchema,
  createRoleSchema,
  roleIdSchema,
  rolePermissionIdSchema,
  updateRoleSchema
} from "@/modules/admin/rbac.validation";

export const adminRbacRoute = Router();

adminRbacRoute.get("/roles", getRoles);
adminRbacRoute.post("/roles", validate(createRoleSchema), createRole);
adminRbacRoute.patch("/roles/:id", validate(updateRoleSchema), updateRole);
adminRbacRoute.delete("/roles/:id", validate(roleIdSchema), deleteRole);
adminRbacRoute.get("/permissions", getPermissions);
adminRbacRoute.post("/permissions", validate(createPermissionSchema), createPermission);
adminRbacRoute.post(
  "/roles/:id/permissions",
  validate(assignRolePermissionsSchema),
  assignRolePermissions
);
adminRbacRoute.delete(
  "/roles/:id/permissions/:permissionId",
  validate(rolePermissionIdSchema),
  removeRolePermission
);
