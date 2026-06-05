import { Router } from "express";

import { getCategories } from "@/modules/categories/categories.controller";

export const categoriesRoute = Router();

categoriesRoute.get("/", getCategories);
