import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import {
  getCategories,
  getCategoryBySlug,
  getCategoryTree
} from "@/modules/categories/categories.controller";
import { categorySlugSchema } from "@/modules/categories/categories.validation";

export const categoriesRoute = Router();

categoriesRoute.get("/", getCategories);
categoriesRoute.get("/tree", getCategoryTree);
categoriesRoute.get("/:slug", validate(categorySlugSchema), getCategoryBySlug);
