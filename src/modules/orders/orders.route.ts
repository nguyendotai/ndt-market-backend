import { Router } from "express";

import { authMiddleware } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { cancelOrder, getOrderByCode, getOrders } from "@/modules/orders/orders.controller";
import { cancelOrderSchema, orderCodeSchema } from "@/modules/orders/orders.validation";

export const ordersRoute = Router();

ordersRoute.use(authMiddleware);
ordersRoute.get("/", getOrders);
ordersRoute.get("/:orderCode", validate(orderCodeSchema), getOrderByCode);
ordersRoute.patch("/:orderCode/cancel", validate(cancelOrderSchema), cancelOrder);
