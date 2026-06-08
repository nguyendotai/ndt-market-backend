import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import { getVariantInventory } from "@/modules/inventories/inventories.controller";
import { variantInventoryQuerySchema } from "@/modules/inventories/inventories.validation";
import {
  getProductBySlug,
  getProducts,
  getRelatedProducts
} from "@/modules/products/products.controller";
import {
  productListQuerySchema,
  productSlugSchema
} from "@/modules/products/products.validation";

export const productsRoute = Router();

productsRoute.get("/", validate(productListQuerySchema), getProducts);
productsRoute.get(
  "/:variantId/inventory",
  validate(variantInventoryQuerySchema),
  getVariantInventory
);
productsRoute.get("/:slug/related", validate(productSlugSchema), getRelatedProducts);
productsRoute.get("/:slug", validate(productSlugSchema), getProductBySlug);
