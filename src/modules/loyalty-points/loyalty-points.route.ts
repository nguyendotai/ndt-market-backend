import { Router } from "express";

import { authMiddleware } from "@/middlewares/auth.middleware";
import * as loyaltyPointController from "@/modules/loyalty-points/loyalty-points.controller";

export const loyaltyPointsRoute = Router();

loyaltyPointsRoute.get("/me", authMiddleware, loyaltyPointController.getMyLoyaltyPoints);
