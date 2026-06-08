import { Router } from "express";

import { authMiddleware } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { applyCoupon } from "@/modules/coupons/coupons.controller";
import { applyCouponSchema } from "@/modules/coupons/coupons.validation";

export const couponsRoute = Router();

couponsRoute.post("/apply", authMiddleware, validate(applyCouponSchema), applyCoupon);
