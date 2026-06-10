import { z } from "zod";

import { ROLES } from "@/constants";
import { USER_STATUSES } from "@/modules/users/users.model";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

const positiveIntQuerySchema = (defaultValue: number) =>
  z.preprocess(
    (value) => (value === undefined || value === "" ? defaultValue : Number(value)),
    z.number().int().positive()
  );

export const adminUserListQuerySchema = {
  query: z.object({
    keyword: z.string().trim().optional(),
    search: z.string().trim().optional(),
    role: z.nativeEnum(ROLES).optional(),
    status: z.nativeEnum(USER_STATUSES).optional(),
    page: positiveIntQuerySchema(1),
    limit: positiveIntQuerySchema(20)
  })
};

export const userIdSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export const updateUserStatusSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    status: z.nativeEnum(USER_STATUSES)
  })
};

export const updateUserRoleSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    role: z.nativeEnum(ROLES),
    permissions: z.array(z.string().trim().min(1)).optional()
  })
};

export type AdminUserListQuery = z.infer<typeof adminUserListQuerySchema.query>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema.body>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema.body>;

export const usersValidation = {
  adminUserListQuerySchema,
  userIdSchema,
  updateUserStatusSchema,
  updateUserRoleSchema
};
