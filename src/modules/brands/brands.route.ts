import { Router } from "express";

import { getBrands } from "@/modules/brands/brands.controller";

export const brandsRoute = Router();

brandsRoute.get("/", getBrands);
