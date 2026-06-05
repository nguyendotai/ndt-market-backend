import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import {
  createProduct,
  createProductImage,
  createProductVariant,
  deleteProduct,
  deleteProductImage,
  deleteProductVariant,
  updateProduct,
  updateProductVariant
} from "@/modules/products/products.controller";
import {
  createProductImageSchema,
  createProductSchema,
  createProductVariantSchema,
  productIdSchema,
  productImageIdSchema,
  productVariantIdSchema,
  updateProductSchema,
  updateProductVariantSchema
} from "@/modules/products/products.validation";

export const adminProductsRoute = Router();

adminProductsRoute.post("/", validate(createProductSchema), createProduct);
adminProductsRoute.patch("/:id", validate(updateProductSchema), updateProduct);
adminProductsRoute.delete("/:id", validate(productIdSchema), deleteProduct);
adminProductsRoute.post("/:id/variants", validate(createProductVariantSchema), createProductVariant);
adminProductsRoute.patch(
  "/variants/:variantId",
  validate(updateProductVariantSchema),
  updateProductVariant
);
adminProductsRoute.delete(
  "/variants/:variantId",
  validate(productVariantIdSchema),
  deleteProductVariant
);
adminProductsRoute.post("/:id/images", validate(createProductImageSchema), createProductImage);
adminProductsRoute.delete(
  "/images/:imageId",
  validate(productImageIdSchema),
  deleteProductImage
);
