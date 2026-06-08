import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import {
  getAdminOrderById,
  getAdminOrders,
  updateOrderStatus
} from "@/modules/orders/orders.controller";
import {
  adminOrderIdSchema,
  adminOrderListQuerySchema,
  updateOrderStatusSchema
} from "@/modules/orders/orders.validation";

export const adminOrdersRoute = Router();

adminOrdersRoute.get("/", validate(adminOrderListQuerySchema), getAdminOrders);
adminOrdersRoute.get("/:id", validate(adminOrderIdSchema), getAdminOrderById);
adminOrdersRoute.patch("/:id/status", validate(updateOrderStatusSchema), updateOrderStatus);
