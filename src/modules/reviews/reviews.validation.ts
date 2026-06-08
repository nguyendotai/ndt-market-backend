import { z } from "zod";

import { REVIEW_STATUSES } from "@/modules/reviews/reviews.model";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const productSlugReviewsSchema = {
  params: z.object({
    slug: z.string().trim().min(1, "Slug is required")
  })
};

export const createReviewSchema = {
  params: z.object({
    productId: objectIdSchema
  }),
  body: z.object({
    order: objectIdSchema,
    rating: z.number().int().min(1).max(5),
    comment: z.string().trim().optional(),
    images: z.array(z.string().trim().url("Image must be a valid URL")).default([])
  })
};

export const updateReviewStatusSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    status: z.enum([REVIEW_STATUSES.APPROVED, REVIEW_STATUSES.REJECTED])
  })
};

export type CreateReviewInput = z.infer<typeof createReviewSchema.body>;
export type UpdateReviewStatusInput = z.infer<typeof updateReviewStatusSchema.body>;
