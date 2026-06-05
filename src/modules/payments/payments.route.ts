import { Router } from "express";

import { getPayments } from "@/modules/payments/payments.controller";

export const paymentsRoute = Router();

paymentsRoute.get("/", getPayments);
