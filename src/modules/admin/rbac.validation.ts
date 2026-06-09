import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const roleIdSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export const rolePermissionIdSchema = {
  params: z.object({
    id: objectIdSchema,
    permissionId: objectIdSchema
  })
};

export const createRoleSchema = {
  body: z.object({
    name: z.string().trim().min(1, "Role name is required"),
    description: z.string().trim().optional()
  })
};

export const updateRoleSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: z
    .object({
      name: z.string().trim().min(1).optional(),
      description: z.string().trim().optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required"
    })
};

export const createPermissionSchema = {
  body: z.object({
    name: z.string().trim().min(1, "Permission name is required"),
    key: z.string().trim().min(1, "Permission key is required"),
    group: z.string().trim().min(1, "Permission group is required")
  })
};

export const assignRolePermissionsSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    permissionIds: z.array(objectIdSchema).min(1, "At least one permission is required")
  })
};

export type CreateRoleInput = z.infer<typeof createRoleSchema.body>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema.body>;
export type CreatePermissionInput = z.infer<typeof createPermissionSchema.body>;
export type AssignRolePermissionsInput = z.infer<typeof assignRolePermissionsSchema.body>;
