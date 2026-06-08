import { z } from "zod";

import { STORE_STATUSES } from "@/modules/stores/stores.model";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

const numberQuerySchema = z.preprocess(
  (value) => (value === undefined || value === "" ? undefined : Number(value)),
  z.number().optional()
);

const storePayloadSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  phone: z.string().trim().min(8).max(20),
  province: z.string().trim().min(1, "Province is required"),
  district: z.string().trim().min(1, "District is required"),
  ward: z.string().trim().min(1, "Ward is required"),
  address: z.string().trim().min(1, "Address is required"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  openingHours: z.string().trim().optional(),
  status: z.nativeEnum(STORE_STATUSES).optional()
});

export const nearbyStoresQuerySchema = {
  query: z.object({
    latitude: numberQuerySchema.pipe(z.number().min(-90).max(90)),
    longitude: numberQuerySchema.pipe(z.number().min(-180).max(180)),
    radiusKm: numberQuerySchema.default(10)
  })
};

export const storeIdSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export const createStoreSchema = {
  body: storePayloadSchema
};

export const updateStoreSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: storePayloadSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required"
  })
};

export type NearbyStoresQuery = z.infer<typeof nearbyStoresQuerySchema.query>;
export type CreateStoreInput = z.infer<typeof createStoreSchema.body>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema.body>;
