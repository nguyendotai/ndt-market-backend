import { Router } from "express";

import { authMiddleware } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { checkout } from "@/modules/orders/orders.controller";
import { checkoutSchema } from "@/modules/orders/orders.validation";

export const checkoutRoute = Router();

checkoutRoute.post("/", authMiddleware, validate(checkoutSchema), checkout);
