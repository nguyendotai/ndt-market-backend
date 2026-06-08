import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const cartItemIdSchema = {
  params: z.object({
    itemId: objectIdSchema
  })
};

export const addCartItemSchema = {
  body: z.object({
    variant: objectIdSchema,
    quantity: z.number().int().positive()
  })
};

export const updateCartItemSchema = {
  params: z.object({
    itemId: objectIdSchema
  }),
  body: z.object({
    quantity: z.number().int().positive()
  })
};

export const updateCartStoreSchema = {
  body: z.object({
    store: objectIdSchema
  })
};

export type AddCartItemInput = z.infer<typeof addCartItemSchema.body>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema.body>;
export type UpdateCartStoreInput = z.infer<typeof updateCartStoreSchema.body>;
