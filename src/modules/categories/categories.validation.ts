import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");
const slugSchema = z.string().trim().min(1, "Slug is required");

const categoryPayloadSchema = z.object({
  parent: objectIdSchema.nullable().optional(),
  name: z.string().trim().min(1, "Name is required"),
  image: z.string().trim().url("Image must be a valid URL").optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional()
});

export const categorySlugSchema = {
  params: z.object({
    slug: slugSchema
  })
};

export const categoryIdSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export const createCategorySchema = {
  body: categoryPayloadSchema
};

export const updateCategorySchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: categoryPayloadSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required"
  })
};

export type CreateCategoryInput = z.infer<typeof createCategorySchema.body>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema.body>;
