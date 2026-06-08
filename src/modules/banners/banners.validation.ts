import { z } from "zod";

import { BANNER_POSITIONS, BANNER_STATUSES } from "@/modules/banners/banners.model";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

const bannerBasePayloadSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  imageUrl: z.string().trim().url("Image URL is invalid"),
  linkUrl: z.string().trim().url("Link URL is invalid").optional(),
  position: z.nativeEnum(BANNER_POSITIONS),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  status: z.nativeEnum(BANNER_STATUSES).optional(),
  sortOrder: z.number().int().optional()
});

const bannerPayloadSchema = bannerBasePayloadSchema.refine(
  (data) => data.startDate < data.endDate,
  {
    message: "Start date must be before end date",
    path: ["endDate"]
  }
);

export const bannerIdSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export const createBannerSchema = {
  body: bannerPayloadSchema
};

export const updateBannerSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: bannerBasePayloadSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required"
    })
    .refine((data) => !data.startDate || !data.endDate || data.startDate < data.endDate, {
      message: "Start date must be before end date",
      path: ["endDate"]
    })
};

export type CreateBannerInput = z.infer<typeof createBannerSchema.body>;
export type UpdateBannerInput = z.infer<typeof updateBannerSchema.body>;
