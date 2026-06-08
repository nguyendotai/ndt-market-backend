import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import {
  createArticle,
  createArticleCategory,
  deleteArticle,
  updateArticle
} from "@/modules/articles/articles.controller";
import {
  articleIdSchema,
  createArticleCategorySchema,
  createArticleSchema,
  updateArticleSchema
} from "@/modules/articles/articles.validation";

export const adminArticleCategoriesRoute = Router();
export const adminArticlesRoute = Router();

adminArticleCategoriesRoute.post(
  "/",
  validate(createArticleCategorySchema),
  createArticleCategory
);

adminArticlesRoute.post("/", validate(createArticleSchema), createArticle);
adminArticlesRoute.patch("/:id", validate(updateArticleSchema), updateArticle);
adminArticlesRoute.delete("/:id", validate(articleIdSchema), deleteArticle);
