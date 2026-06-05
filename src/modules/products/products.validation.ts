import { z } from "zod";

import {
  PRODUCT_STATUSES,
  PRODUCT_VARIANT_STATUSES
} from "@/modules/products/products.model";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");
const optionalUrlSchema = z.string().trim().url("URL is invalid").optional();

const numberQuerySchema = z.preprocess(
  (value) => (value === undefined || value === "" ? undefined : Number(value)),
  z.number().min(0).optional()
);

const positiveIntQuerySchema = (defaultValue: number) =>
  z.preprocess(
    (value) => (value === undefined || value === "" ? defaultValue : Number(value)),
    z.number().int().positive()
  );

export const productListQuerySchema = {
  query: z
    .object({
      keyword: z.string().trim().optional(),
      category: z.string().trim().optional(),
      brand: z.string().trim().optional(),
      minPrice: numberQuerySchema,
      maxPrice: numberQuerySchema,
      sort: z
        .enum(["newest", "oldest", "price_asc", "price_desc", "sold_desc", "rating_desc"])
        .default("newest"),
      page: positiveIntQuerySchema(1),
      limit: positiveIntQuerySchema(10)
    })
    .refine(
      (data) =>
        data.minPrice === undefined ||
        data.maxPrice === undefined ||
        data.minPrice <= data.maxPrice,
      {
        message: "minPrice must be less than or equal to maxPrice",
        path: ["minPrice"]
      }
    )
};

export const productSlugSchema = {
  params: z.object({
    slug: z.string().trim().min(1, "Slug is required")
  })
};

export const productIdSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export const productVariantIdSchema = {
  params: z.object({
    variantId: objectIdSchema
  })
};

export const productImageIdSchema = {
  params: z.object({
    imageId: objectIdSchema
  })
};

const productPayloadSchema = z.object({
  category: objectIdSchema,
  brand: objectIdSchema.nullable().optional(),
  name: z.string().trim().min(1, "Name is required"),
  sku: z.string().trim().min(1, "SKU is required"),
  description: z.string().trim().optional(),
  shortDescription: z.string().trim().optional(),
  unit: z.string().trim().optional(),
  origin: z.string().trim().optional(),
  ingredients: z.array(z.string().trim().min(1)).default([]),
  storageInstruction: z.string().trim().optional(),
  status: z.nativeEnum(PRODUCT_STATUSES).optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
  soldCount: z.number().int().min(0).optional(),
  ratingAverage: z.number().min(0).max(5).optional(),
  ratingCount: z.number().int().min(0).optional()
});

const variantBasePayloadSchema = z.object({
    name: z.string().trim().min(1, "Variant name is required"),
    barcode: z.string().trim().optional(),
    price: z.number().min(0),
    salePrice: z.number().min(0).optional(),
    weight: z.number().min(0).optional(),
    unit: z.string().trim().optional(),
    status: z.nativeEnum(PRODUCT_VARIANT_STATUSES).optional()
  });

const variantPayloadSchema = variantBasePayloadSchema.refine(
  (data) => data.salePrice === undefined || data.salePrice <= data.price,
  {
    message: "Sale price must be less than or equal to price",
    path: ["salePrice"]
  }
);

const imagePayloadSchema = z.object({
  imageUrl: optionalUrlSchema.unwrap(),
  isThumbnail: z.boolean().optional(),
  sortOrder: z.number().int().optional()
});

export const createProductSchema = {
  body: productPayloadSchema
};

export const updateProductSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: productPayloadSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required"
  })
};

export const createProductVariantSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: variantPayloadSchema
};

export const updateProductVariantSchema = {
  params: z.object({
    variantId: objectIdSchema
  }),
  body: variantBasePayloadSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required"
    })
    .refine(
      (data) =>
        data.salePrice === undefined ||
        data.price === undefined ||
        data.salePrice <= data.price,
      {
        message: "Sale price must be less than or equal to price",
        path: ["salePrice"]
      }
    )
};

export const createProductImageSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: imagePayloadSchema
};

export type ProductListQuery = z.infer<typeof productListQuerySchema.query>;
export type CreateProductInput = z.infer<typeof createProductSchema.body>;
export type UpdateProductInput = z.infer<typeof updateProductSchema.body>;
export type CreateProductVariantInput = z.infer<typeof createProductVariantSchema.body>;
export type UpdateProductVariantInput = z.infer<typeof updateProductVariantSchema.body>;
export type CreateProductImageInput = z.infer<typeof createProductImageSchema.body>;
