import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon
} from "@/modules/coupons/coupons.controller";
import {
  couponIdSchema,
  createCouponSchema,
  updateCouponSchema
} from "@/modules/coupons/coupons.validation";

export const adminCouponsRoute = Router();

adminCouponsRoute.post("/", validate(createCouponSchema), createCoupon);
adminCouponsRoute.get("/", getCoupons);
adminCouponsRoute.patch("/:id", validate(updateCouponSchema), updateCoupon);
adminCouponsRoute.delete("/:id", validate(couponIdSchema), deleteCoupon);
