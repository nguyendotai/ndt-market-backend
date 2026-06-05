import { Router } from "express";

import { getCoupons } from "@/modules/coupons/coupons.controller";

export const couponsRoute = Router();

couponsRoute.get("/", getCoupons);
