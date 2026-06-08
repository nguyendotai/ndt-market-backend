import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import { getArticleBySlug, getArticles } from "@/modules/articles/articles.controller";
import { articleSlugSchema } from "@/modules/articles/articles.validation";

export const articlesRoute = Router();

articlesRoute.get("/", getArticles);
articlesRoute.get("/:slug", validate(articleSlugSchema), getArticleBySlug);
