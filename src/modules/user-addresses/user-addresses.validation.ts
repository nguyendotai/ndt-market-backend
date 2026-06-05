import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

const addressPayloadSchema = z.object({
  receiverName: z.string().trim().min(1, "Receiver name is required"),
  phone: z.string().trim().min(8).max(20),
  province: z.string().trim().min(1, "Province is required"),
  district: z.string().trim().min(1, "District is required"),
  ward: z.string().trim().min(1, "Ward is required"),
  addressDetail: z.string().trim().min(1, "Address detail is required"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  isDefault: z.boolean().optional()
});

export const createUserAddressSchema = {
  body: addressPayloadSchema
};

export const updateUserAddressSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: addressPayloadSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required"
  })
};

export const userAddressIdSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export const adminUserAddressQuerySchema = {
  query: z.object({
    userId: objectIdSchema.optional()
  })
};

export const adminCreateUserAddressSchema = {
  body: addressPayloadSchema.extend({
    user: objectIdSchema
  })
};

export type CreateUserAddressInput = z.infer<typeof createUserAddressSchema.body>;
export type UpdateUserAddressInput = z.infer<typeof updateUserAddressSchema.body>;
export type AdminCreateUserAddressInput = z.infer<typeof adminCreateUserAddressSchema.body>;
