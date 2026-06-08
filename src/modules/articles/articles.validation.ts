import { z } from "zod";

import { ARTICLE_STATUSES } from "@/modules/articles/articles.model";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const articleSlugSchema = {
  params: z.object({
    slug: z.string().trim().min(1, "Slug is required")
  })
};

export const articleIdSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export const createArticleCategorySchema = {
  body: z.object({
    name: z.string().trim().min(1, "Name is required")
  })
};

const articlePayloadSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  thumbnail: z.string().trim().url("Thumbnail is invalid").optional(),
  content: z.string().trim().min(1, "Content is required"),
  excerpt: z.string().trim().optional(),
  category: objectIdSchema.optional(),
  status: z.nativeEnum(ARTICLE_STATUSES).optional(),
  publishedAt: z.coerce.date().optional()
});

export const createArticleSchema = {
  body: articlePayloadSchema
};

export const updateArticleSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: articlePayloadSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required"
  })
};

export type CreateArticleCategoryInput = z.infer<typeof createArticleCategorySchema.body>;
export type CreateArticleInput = z.infer<typeof createArticleSchema.body>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema.body>;
