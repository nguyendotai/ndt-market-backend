import { z } from "zod";

import { SHIPMENT_STATUSES, SHIPPER_STATUSES } from "@/modules/delivery/delivery.model";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const deliveryTimeSlotQuerySchema = {
  query: z.object({
    storeId: objectIdSchema,
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format")
  })
};

const timeSlotBasePayloadSchema = z.object({
    store: objectIdSchema,
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    maxOrders: z.number().int().positive(),
    currentOrders: z.number().int().min(0).optional(),
    isActive: z.boolean().optional()
  });

const timeSlotPayloadSchema = timeSlotBasePayloadSchema.refine(
  (data) => data.startTime < data.endTime,
  {
    message: "Start time must be before end time",
    path: ["endTime"]
  }
);

export const createDeliveryTimeSlotSchema = {
  body: timeSlotPayloadSchema
};

export const updateDeliveryTimeSlotSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: timeSlotBasePayloadSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required"
    })
    .refine(
      (data) =>
        !data.startTime || !data.endTime || data.startTime < data.endTime,
      {
        message: "Start time must be before end time",
        path: ["endTime"]
      }
    )
};

export const assignShipmentSchema = {
  params: z.object({
    orderId: objectIdSchema
  }),
  body: z.object({
    shipper: objectIdSchema,
    shippingPartner: z.string().trim().optional(),
    trackingCode: z.string().trim().optional(),
    note: z.string().trim().optional()
  })
};

export const updateShipperShipmentStatusSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    status: z.enum([
      SHIPMENT_STATUSES.PICKED_UP,
      SHIPMENT_STATUSES.DELIVERING,
      SHIPMENT_STATUSES.DELIVERED,
      SHIPMENT_STATUSES.FAILED
    ]),
    note: z.string().trim().optional()
  })
};

export const shipperQuerySchema = {
  query: z.object({
    status: z.nativeEnum(SHIPMENT_STATUSES).optional()
  })
};

export const upsertShipperSchema = {
  body: z.object({
    user: objectIdSchema,
    vehicleType: z.string().trim().optional(),
    status: z.nativeEnum(SHIPPER_STATUSES).optional()
  })
};

export type DeliveryTimeSlotQuery = z.infer<typeof deliveryTimeSlotQuerySchema.query>;
export type CreateDeliveryTimeSlotInput = z.infer<typeof createDeliveryTimeSlotSchema.body>;
export type UpdateDeliveryTimeSlotInput = z.infer<typeof updateDeliveryTimeSlotSchema.body>;
export type AssignShipmentInput = z.infer<typeof assignShipmentSchema.body>;
export type UpdateShipperShipmentStatusInput = z.infer<
  typeof updateShipperShipmentStatusSchema.body
>;
export type ShipperQuery = z.infer<typeof shipperQuerySchema.query>;
