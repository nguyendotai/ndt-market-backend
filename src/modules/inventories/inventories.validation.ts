import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

const numberQuerySchema = z.preprocess(
  (value) => (value === undefined || value === "" ? undefined : Number(value)),
  z.number().optional()
);

const booleanQuerySchema = z.preprocess((value) => {
  if (value === undefined || value === "") {
    return undefined;
  }

  if (value === "true" || value === true) {
    return true;
  }

  if (value === "false" || value === false) {
    return false;
  }

  return value;
}, z.boolean().optional());

const bodyNumberSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce.number()
);

export const inventoryListQuerySchema = {
  query: z.object({
    storeId: objectIdSchema.optional(),
    variantId: objectIdSchema.optional(),
    keyword: z.string().trim().optional(),
    search: z.string().trim().optional(),
    lowStock: booleanQuerySchema
  })
};

export const stockMovementListQuerySchema = {
  query: z.object({
    storeId: objectIdSchema.optional(),
    variantId: objectIdSchema.optional(),
    type: z.enum(["IMPORT", "EXPORT", "ADJUST", "RESERVE", "RELEASE"]).optional(),
    keyword: z.string().trim().optional(),
    search: z.string().trim().optional()
  })
};

export const variantInventoryQuerySchema = {
  params: z.object({
    variantId: objectIdSchema
  }),
  query: z.object({
    storeId: objectIdSchema.optional()
  })
};

export const inventoryIdSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export const updateInventorySchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: z
    .object({
      quantity: bodyNumberSchema.pipe(z.number().int().min(0)).optional(),
      reservedQuantity: bodyNumberSchema.pipe(z.number().int().min(0)).optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required"
    })
};

export const importInventorySchema = {
  body: z.object({
    store: objectIdSchema,
    variant: objectIdSchema,
    quantity: bodyNumberSchema.pipe(z.number().int().positive()),
    reason: z.string().trim().optional()
  })
};

export const adjustInventorySchema = {
  body: z.object({
    store: objectIdSchema,
    variant: objectIdSchema,
    quantity: bodyNumberSchema.pipe(z.number().int()).refine((value) => value !== 0, {
      message: "Quantity must be different from 0"
    }),
    reason: z.string().trim().min(1, "Reason is required")
  })
};

export const reserveInventorySchema = {
  body: z.object({
    store: objectIdSchema,
    variant: objectIdSchema,
    quantity: bodyNumberSchema.pipe(z.number().int().positive()),
    reason: z.string().trim().optional()
  })
};

export const releaseInventorySchema = reserveInventorySchema;

export const inventoryNearbyQuerySchema = {
  query: z.object({
    quantity: numberQuerySchema.default(1)
  })
};

export type InventoryListQuery = z.infer<typeof inventoryListQuerySchema.query>;
export type StockMovementListQuery = z.infer<typeof stockMovementListQuerySchema.query>;
export type VariantInventoryQuery = z.infer<typeof variantInventoryQuerySchema.query>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema.body>;
export type ImportInventoryInput = z.infer<typeof importInventorySchema.body>;
export type AdjustInventoryInput = z.infer<typeof adjustInventorySchema.body>;
export type ReserveInventoryInput = z.infer<typeof reserveInventorySchema.body>;
