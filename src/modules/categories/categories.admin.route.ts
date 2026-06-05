import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import {
  createCategory,
  deleteCategory,
  updateCategory
} from "@/modules/categories/categories.controller";
import {
  categoryIdSchema,
  createCategorySchema,
  updateCategorySchema
} from "@/modules/categories/categories.validation";

export const adminCategoriesRoute = Router();

adminCategoriesRoute.post("/", validate(createCategorySchema), createCategory);
adminCategoriesRoute.patch("/:id", validate(updateCategorySchema), updateCategory);
adminCategoriesRoute.delete("/:id", validate(categoryIdSchema), deleteCategory);
