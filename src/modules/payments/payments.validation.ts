import { z } from "zod";

import { PAYMENT_METHODS } from "@/modules/payments/payments.model";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const paymentOrderCodeSchema = {
  params: z.object({
    orderCode: z.string().trim().min(1, "Order code is required")
  })
};

export const createPaymentSchema = {
  params: z.object({
    orderCode: z.string().trim().min(1, "Order code is required")
  }),
  body: z.object({
    method: z.enum([PAYMENT_METHODS.COD, PAYMENT_METHODS.BANK_TRANSFER]),
    transactionCode: z.string().trim().optional()
  })
};

export const paymentWebhookSchema = {
  body: z.record(z.unknown())
};

export const adminPaymentIdSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export const confirmPaymentSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    transactionCode: z.string().trim().optional(),
    rawResponse: z.record(z.unknown()).optional()
  })
};

export const refundPaymentSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    reason: z.string().trim().optional(),
    rawResponse: z.record(z.unknown()).optional()
  })
};

export type CreatePaymentInput = z.infer<typeof createPaymentSchema.body>;
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema.body>;
export type RefundPaymentInput = z.infer<typeof refundPaymentSchema.body>;
