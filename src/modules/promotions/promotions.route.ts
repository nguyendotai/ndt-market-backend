import { Router } from "express";

import { getPromotions } from "@/modules/promotions/promotions.controller";

export const promotionsRoute = Router();

promotionsRoute.get("/", getPromotions);
