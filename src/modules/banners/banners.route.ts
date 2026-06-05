import { Router } from "express";

import { getBanners } from "@/modules/banners/banners.controller";

export const bannersRoute = Router();

bannersRoute.get("/", getBanners);
