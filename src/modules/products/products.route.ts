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
import { authMiddleware } from "@/middlewares/auth.middleware";
import { createReview, getProductReviews } from "@/modules/reviews/reviews.controller";
import {
  createReviewSchema,
  productSlugReviewsSchema
} from "@/modules/reviews/reviews.validation";

export const productsRoute = Router();

productsRoute.get("/", validate(productListQuerySchema), getProducts);
productsRoute.get(
  "/:variantId/inventory",
  validate(variantInventoryQuerySchema),
  getVariantInventory
);
productsRoute.get("/:slug/reviews", validate(productSlugReviewsSchema), getProductReviews);
productsRoute.post(
  "/:productId/reviews",
  authMiddleware,
  validate(createReviewSchema),
  createReview
);
productsRoute.get("/:slug/related", validate(productSlugSchema), getRelatedProducts);
productsRoute.get("/:slug", validate(productSlugSchema), getProductBySlug);
