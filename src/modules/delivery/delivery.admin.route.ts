import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import {
  assignShipment,
  createDeliveryTimeSlot,
  updateDeliveryTimeSlot
} from "@/modules/delivery/delivery.controller";
import {
  assignShipmentSchema,
  createDeliveryTimeSlotSchema,
  updateDeliveryTimeSlotSchema
} from "@/modules/delivery/delivery.validation";

export const adminDeliveryRoute = Router();
export const adminShipmentsRoute = Router();

adminDeliveryRoute.post(
  "/time-slots",
  validate(createDeliveryTimeSlotSchema),
  createDeliveryTimeSlot
);
adminDeliveryRoute.patch(
  "/time-slots/:id",
  validate(updateDeliveryTimeSlotSchema),
  updateDeliveryTimeSlot
);

adminShipmentsRoute.post("/:orderId/assign", validate(assignShipmentSchema), assignShipment);
