import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import { createBrand, deleteBrand, updateBrand } from "@/modules/brands/brands.controller";
import {
  brandIdSchema,
  createBrandSchema,
  updateBrandSchema
} from "@/modules/brands/brands.validation";

export const adminBrandsRoute = Router();

adminBrandsRoute.post("/", validate(createBrandSchema), createBrand);
adminBrandsRoute.patch("/:id", validate(updateBrandSchema), updateBrand);
adminBrandsRoute.delete("/:id", validate(brandIdSchema), deleteBrand);
