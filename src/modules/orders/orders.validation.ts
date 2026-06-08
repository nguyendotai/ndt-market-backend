import { z } from "zod";

import { ORDER_STATUS, PAYMENT_STATUS } from "@/constants";
import { DELIVERY_TYPES } from "@/modules/orders/orders.model";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

const orderAddressSchema = z.object({
  receiverName: z.string().trim().min(1, "Receiver name is required"),
  phone: z.string().trim().min(8).max(20),
  province: z.string().trim().min(1, "Province is required"),
  district: z.string().trim().min(1, "District is required"),
  ward: z.string().trim().min(1, "Ward is required"),
  addressDetail: z.string().trim().min(1, "Address detail is required"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional()
});

export const checkoutSchema = {
  body: z
    .object({
      deliveryType: z.nativeEnum(DELIVERY_TYPES),
      address: orderAddressSchema.optional(),
      timeSlot: objectIdSchema.optional(),
      note: z.string().trim().optional(),
      shippingFee: z.number().min(0).default(0),
      discountTotal: z.number().min(0).default(0)
    })
    .refine((data) => data.deliveryType !== DELIVERY_TYPES.DELIVERY || data.address, {
      message: "Address is required for delivery orders",
      path: ["address"]
    })
    .refine((data) => data.deliveryType !== DELIVERY_TYPES.DELIVERY || data.timeSlot, {
      message: "Time slot is required for delivery orders",
      path: ["timeSlot"]
    })
};

export const orderCodeSchema = {
  params: z.object({
    orderCode: z.string().trim().min(1, "Order code is required")
  })
};

export const cancelOrderSchema = {
  params: z.object({
    orderCode: z.string().trim().min(1, "Order code is required")
  }),
  body: z.object({
    note: z.string().trim().optional()
  })
};

export const adminOrderListQuerySchema = {
  query: z.object({
    status: z.nativeEnum(ORDER_STATUS).optional(),
    paymentStatus: z.nativeEnum(PAYMENT_STATUS).optional(),
    userId: objectIdSchema.optional(),
    storeId: objectIdSchema.optional()
  })
};

export const adminOrderIdSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export const updateOrderStatusSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    status: z.nativeEnum(ORDER_STATUS),
    note: z.string().trim().optional()
  })
};

export type CheckoutInput = z.infer<typeof checkoutSchema.body>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema.body>;
export type AdminOrderListQuery = z.infer<typeof adminOrderListQuerySchema.query>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema.body>;
