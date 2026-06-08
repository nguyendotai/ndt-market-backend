import { Router } from "express";

import { ROLES } from "@/constants";
import { authMiddleware, authorizeRoles } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import {
  getMyShipments,
  updateMyShipmentStatus
} from "@/modules/delivery/delivery.controller";
import {
  shipperQuerySchema,
  updateShipperShipmentStatusSchema
} from "@/modules/delivery/delivery.validation";

export const shipperRoute = Router();

shipperRoute.use(authMiddleware, authorizeRoles(ROLES.SHIPPER));
shipperRoute.get("/shipments", validate(shipperQuerySchema), getMyShipments);
shipperRoute.patch(
  "/shipments/:id/status",
  validate(updateShipperShipmentStatusSchema),
  updateMyShipmentStatus
);
