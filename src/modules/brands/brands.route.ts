import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import { getBrandBySlug, getBrands } from "@/modules/brands/brands.controller";
import { brandSlugSchema } from "@/modules/brands/brands.validation";

export const brandsRoute = Router();

brandsRoute.get("/", getBrands);
brandsRoute.get("/:slug", validate(brandSlugSchema), getBrandBySlug);
