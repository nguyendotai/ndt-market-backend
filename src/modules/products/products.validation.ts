import { z } from "zod";

import {
  PRODUCT_STATUSES,
  PRODUCT_VARIANT_STATUSES
} from "@/modules/products/products.model";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");
const optionalUrlSchema = z.string().trim().url("URL is invalid").optional();
const optionalFormUrlSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  optionalUrlSchema
);

const emptyStringToUndefined = (value: unknown) => {
  if (value === "") {
    return undefined;
  }

  return value;
};

const optionalNumberBodySchema = z.preprocess(
  emptyStringToUndefined,
  z.coerce.number().min(0).optional()
);

const optionalIntBodySchema = z.preprocess(
  emptyStringToUndefined,
  z.coerce.number().int().min(0).optional()
);

const optionalStatusSchema = <T extends Record<string, string>>(enumObject: T) =>
  z.preprocess(emptyStringToUndefined, z.nativeEnum(enumObject).optional());

const optionalBooleanBodySchema = z.preprocess((value) => {
  if (value === "") {
    return undefined;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return value;
}, z.boolean().optional());

const stringListBodySchema = z.preprocess((value) => {
  if (value === undefined || value === "") {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return value;
}, z.array(z.string().trim().min(1)).default([]));

const optionalBrandSchema = z.preprocess((value) => {
  if (value === "") {
    return null;
  }

  return value;
}, objectIdSchema.nullable().optional());

const optionalSkuSchema = z.preprocess(
  emptyStringToUndefined,
  z.string().trim().min(1, "SKU is required").optional()
);

const optionalBarcodeSchema = z.preprocess(
  emptyStringToUndefined,
  z.string().trim().min(1, "Barcode is required").optional()
);

const numberQuerySchema = z.preprocess(
  (value) => (value === undefined || value === "" ? undefined : Number(value)),
  z.number().min(0).optional()
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

const tagsQuerySchema = z.preprocess((value) => {
  if (value === undefined || value === "") {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value.split(",").map((tag) => tag.trim()).filter(Boolean);
  }

  return value;
}, z.array(z.string().trim().min(1)).optional());

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
      origin: z.string().trim().optional(),
      tags: tagsQuerySchema,
      rating: numberQuerySchema.pipe(z.number().min(0).max(5).optional()),
      inStock: booleanQuerySchema,
      storeId: objectIdSchema.optional(),
      sort: z
        .enum([
          "newest",
          "oldest",
          "price_asc",
          "price_desc",
          "best_selling",
          "rating",
          "sold_desc",
          "rating_desc"
        ])
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
  brand: optionalBrandSchema,
  name: z.string().trim().min(1, "Name is required"),
  sku: optionalSkuSchema,
  description: z.string().trim().optional(),
  shortDescription: z.string().trim().optional(),
  unit: z.string().trim().optional(),
  origin: z.string().trim().optional(),
  ingredients: stringListBodySchema,
  storageInstruction: z.string().trim().optional(),
  status: optionalStatusSchema(PRODUCT_STATUSES),
  tags: stringListBodySchema,
  soldCount: optionalIntBodySchema,
  ratingAverage: optionalNumberBodySchema.pipe(z.number().max(5).optional()),
  ratingCount: optionalIntBodySchema
});

const variantBasePayloadSchema = z.object({
    name: z.string().trim().min(1, "Variant name is required"),
    barcode: optionalBarcodeSchema,
    imageUrl: optionalFormUrlSchema,
    price: z.coerce.number().min(0),
    salePrice: optionalNumberBodySchema,
    weight: optionalNumberBodySchema,
    unit: z.string().trim().optional(),
    status: optionalStatusSchema(PRODUCT_VARIANT_STATUSES)
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
  isThumbnail: optionalBooleanBodySchema,
  sortOrder: z.preprocess(emptyStringToUndefined, z.coerce.number().int().optional())
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
