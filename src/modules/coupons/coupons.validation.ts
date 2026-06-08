import { z } from "zod";

import { DISCOUNT_TYPES, PROMOTION_STATUSES } from "@/modules/promotions/promotions.model";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

const couponPayloadSchema = z.object({
  code: z.string().trim().min(1, "Code is required"),
  discountType: z.nativeEnum(DISCOUNT_TYPES),
  discountValue: z.number().min(0),
  minOrderValue: z.number().min(0).default(0),
  maxDiscount: z.number().min(0).optional(),
  usageLimit: z.number().int().positive().optional(),
  userLimit: z.number().int().positive().default(1),
  expiredAt: z.coerce.date(),
  status: z.nativeEnum(PROMOTION_STATUSES).optional()
});

export const applyCouponSchema = {
  body: z.object({
    code: z.string().trim().min(1, "Code is required"),
    orderValue: z.number().min(0)
  })
};

export const couponIdSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export const createCouponSchema = {
  body: couponPayloadSchema
};

export const updateCouponSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: couponPayloadSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required"
  })
};

export type ApplyCouponInput = z.infer<typeof applyCouponSchema.body>;
export type CreateCouponInput = z.infer<typeof createCouponSchema.body>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema.body>;
