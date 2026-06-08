import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import { createBanner, deleteBanner, updateBanner } from "@/modules/banners/banners.controller";
import {
  bannerIdSchema,
  createBannerSchema,
  updateBannerSchema
} from "@/modules/banners/banners.validation";

export const adminBannersRoute = Router();

adminBannersRoute.post("/", validate(createBannerSchema), createBanner);
adminBannersRoute.patch("/:id", validate(updateBannerSchema), updateBanner);
adminBannersRoute.delete("/:id", validate(bannerIdSchema), deleteBanner);
