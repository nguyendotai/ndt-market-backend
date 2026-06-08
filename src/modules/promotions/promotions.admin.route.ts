import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import {
  createPromotion,
  deletePromotion,
  updatePromotion
} from "@/modules/promotions/promotions.controller";
import {
  createPromotionSchema,
  promotionIdSchema,
  updatePromotionSchema
} from "@/modules/promotions/promotions.validation";

export const adminPromotionsRoute = Router();

adminPromotionsRoute.post("/", validate(createPromotionSchema), createPromotion);
adminPromotionsRoute.patch("/:id", validate(updatePromotionSchema), updatePromotion);
adminPromotionsRoute.delete("/:id", validate(promotionIdSchema), deletePromotion);
