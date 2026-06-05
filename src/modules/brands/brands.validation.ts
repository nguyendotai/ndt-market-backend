import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");
const slugSchema = z.string().trim().min(1, "Slug is required");

const brandPayloadSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  logo: z.string().trim().url("Logo must be a valid URL").optional(),
  description: z.string().trim().optional(),
  isActive: z.boolean().optional()
});

export const brandSlugSchema = {
  params: z.object({
    slug: slugSchema
  })
};

export const brandIdSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export const createBrandSchema = {
  body: brandPayloadSchema
};

export const updateBrandSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: brandPayloadSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required"
  })
};

export type CreateBrandInput = z.infer<typeof createBrandSchema.body>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema.body>;
