import { z } from "zod";

import { LOYALTY_POINT_TYPES } from "@/modules/loyalty-points/loyalty-points.model";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const adminLoyaltyPointQuerySchema = {
  query: z.object({
    userId: objectIdSchema.optional(),
    type: z.nativeEnum(LOYALTY_POINT_TYPES).optional()
  })
};

export const adjustLoyaltyPointSchema = {
  body: z.object({
    user: objectIdSchema,
    order: objectIdSchema.optional(),
    points: z.number().int().refine((value) => value !== 0, {
      message: "Points must be different from 0"
    }),
    type: z.enum([LOYALTY_POINT_TYPES.ADJUST, LOYALTY_POINT_TYPES.REFUND]).default(
      LOYALTY_POINT_TYPES.ADJUST
    ),
    note: z.string().trim().min(1, "Note is required")
  })
};

export type AdjustLoyaltyPointInput = z.infer<typeof adjustLoyaltyPointSchema.body>;
