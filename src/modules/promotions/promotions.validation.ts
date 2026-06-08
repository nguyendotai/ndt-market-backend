import { z } from "zod";

import {
  DISCOUNT_TYPES,
  PROMOTION_STATUSES,
  PROMOTION_TYPES
} from "@/modules/promotions/promotions.model";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

const promotionPayloadSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    type: z.nativeEnum(PROMOTION_TYPES),
    discountType: z.nativeEnum(DISCOUNT_TYPES),
    discountValue: z.number().min(0),
    minOrderValue: z.number().min(0).default(0),
    maxDiscount: z.number().min(0).optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    status: z.nativeEnum(PROMOTION_STATUSES).optional(),
    variants: z.array(objectIdSchema).default([])
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "Start date must be before end date",
    path: ["endDate"]
  });

const promotionBasePayloadSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  type: z.nativeEnum(PROMOTION_TYPES),
  discountType: z.nativeEnum(DISCOUNT_TYPES),
  discountValue: z.number().min(0),
  minOrderValue: z.number().min(0),
  maxDiscount: z.number().min(0).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  status: z.nativeEnum(PROMOTION_STATUSES).optional(),
  variants: z.array(objectIdSchema).optional()
});

export const promotionIdSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export const createPromotionSchema = {
  body: promotionPayloadSchema
};

export const updatePromotionSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: promotionBasePayloadSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required"
    })
    .refine((data) => !data.startDate || !data.endDate || data.startDate < data.endDate, {
      message: "Start date must be before end date",
      path: ["endDate"]
    })
};

export type CreatePromotionInput = z.infer<typeof createPromotionSchema.body>;
export type UpdatePromotionInput = z.infer<typeof updatePromotionSchema.body>;
