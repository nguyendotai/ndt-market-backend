import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";
import { confirmPayment, refundPayment } from "@/modules/payments/payments.controller";
import {
  confirmPaymentSchema,
  refundPaymentSchema
} from "@/modules/payments/payments.validation";

export const adminPaymentsRoute = Router();

adminPaymentsRoute.patch("/:id/confirm", validate(confirmPaymentSchema), confirmPayment);
adminPaymentsRoute.patch("/:id/refund", validate(refundPaymentSchema), refundPayment);
