import { Router } from "express";

import { authMiddleware } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import {
  createPayment,
  getPaymentByOrderCode,
  handleMomoWebhook,
  handleVnpayWebhook
} from "@/modules/payments/payments.controller";
import {
  createPaymentSchema,
  paymentOrderCodeSchema,
  paymentWebhookSchema
} from "@/modules/payments/payments.validation";

export const paymentsRoute = Router();

paymentsRoute.post(
  "/:orderCode/create",
  authMiddleware,
  validate(createPaymentSchema),
  createPayment
);
paymentsRoute.post("/webhook/momo", validate(paymentWebhookSchema), handleMomoWebhook);
paymentsRoute.post("/webhook/vnpay", validate(paymentWebhookSchema), handleVnpayWebhook);
paymentsRoute.get(
  "/:orderCode",
  authMiddleware,
  validate(paymentOrderCodeSchema),
  getPaymentByOrderCode
);
