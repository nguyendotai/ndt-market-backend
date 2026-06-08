import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import { getDeliveryTimeSlots } from "@/modules/delivery/delivery.controller";
import { deliveryTimeSlotQuerySchema } from "@/modules/delivery/delivery.validation";

export const deliveryRoute = Router();

deliveryRoute.get("/time-slots", validate(deliveryTimeSlotQuerySchema), getDeliveryTimeSlots);
