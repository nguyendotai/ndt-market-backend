import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import * as loyaltyPointController from "@/modules/loyalty-points/loyalty-points.controller";
import {
  adminLoyaltyPointQuerySchema,
  adjustLoyaltyPointSchema
} from "@/modules/loyalty-points/loyalty-points.validation";

export const adminLoyaltyPointsRoute = Router();

adminLoyaltyPointsRoute.get(
  "/",
  validate(adminLoyaltyPointQuerySchema),
  loyaltyPointController.getAllLoyaltyPoints
);
adminLoyaltyPointsRoute.post(
  "/adjust",
  validate(adjustLoyaltyPointSchema),
  loyaltyPointController.adjustLoyaltyPoints
);
