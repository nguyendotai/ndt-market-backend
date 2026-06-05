import { z } from "zod";

import { MEMBERSHIP_TIER_STATUSES } from "@/modules/membership-tiers/membership-tiers.model";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

const membershipTierPayloadSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  minPoint: z.number().int().min(0),
  discountPercent: z.number().min(0).max(100),
  benefits: z.array(z.string().trim().min(1)).default([]),
  status: z.nativeEnum(MEMBERSHIP_TIER_STATUSES).optional()
});

export const createMembershipTierSchema = {
  body: membershipTierPayloadSchema
};

export const updateMembershipTierSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: membershipTierPayloadSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required"
  })
};

export const membershipTierIdSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export type CreateMembershipTierInput = z.infer<typeof createMembershipTierSchema.body>;
export type UpdateMembershipTierInput = z.infer<typeof updateMembershipTierSchema.body>;
