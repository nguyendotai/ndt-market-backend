import { Router } from "express";

import { getArticles } from "@/modules/articles/articles.controller";

export const articlesRoute = Router();

articlesRoute.get("/", getArticles);
