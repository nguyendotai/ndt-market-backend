import { Router } from "express";

import { getOrders } from "@/modules/orders/orders.controller";

export const ordersRoute = Router();

ordersRoute.get("/", getOrders);
