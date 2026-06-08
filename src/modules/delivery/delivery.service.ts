import { Types } from "mongoose";

import { HTTP_STATUS, ORDER_STATUS } from "@/constants";
import {
  DeliveryTimeSlotModel,
  SHIPMENT_STATUSES,
  SHIPPER_STATUSES,
  ShipmentModel,
  ShipperModel
} from "@/modules/delivery/delivery.model";
import {
  AssignShipmentInput,
  CreateDeliveryTimeSlotInput,
  DeliveryTimeSlotQuery,
  ShipperQuery,
  UpdateDeliveryTimeSlotInput,
  UpdateShipperShipmentStatusInput
} from "@/modules/delivery/delivery.validation";
import { OrderModel } from "@/modules/orders/orders.model";
import { ApiError } from "@/utils/ApiError";

const getDateRange = (date: string) => {
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
};

export const getDeliveryTimeSlots = (query: DeliveryTimeSlotQuery) => {
  const { start, end } = getDateRange(query.date);

  return DeliveryTimeSlotModel.find({
    store: query.storeId,
    startTime: { $gte: start, $lt: end },
    isActive: true
  }).sort({ startTime: 1 });
};

export const createDeliveryTimeSlot = (payload: CreateDeliveryTimeSlotInput) =>
  DeliveryTimeSlotModel.create(payload);

export const updateDeliveryTimeSlot = async (
  id: string,
  payload: UpdateDeliveryTimeSlotInput
) => {
  const timeSlot = await DeliveryTimeSlotModel.findByIdAndUpdate(id, payload, { new: true });

  if (!timeSlot) {
    throw new ApiError("Delivery time slot not found", HTTP_STATUS.NOT_FOUND);
  }

  if (timeSlot.currentOrders > timeSlot.maxOrders) {
    throw new ApiError("Current orders cannot exceed max orders", HTTP_STATUS.BAD_REQUEST);
  }

  return timeSlot;
};

export const reserveDeliveryTimeSlot = async (
  timeSlotId: string,
  storeId: string | Types.ObjectId
) => {
  const timeSlot = await DeliveryTimeSlotModel.findOneAndUpdate(
    {
      _id: timeSlotId,
      store: storeId,
      isActive: true,
      $expr: { $lt: ["$currentOrders", "$maxOrders"] }
    },
    { $inc: { currentOrders: 1 } },
    { new: true }
  );

  if (!timeSlot) {
    throw new ApiError("Delivery time slot is full or unavailable", HTTP_STATUS.BAD_REQUEST);
  }

  return timeSlot;
};

export const releaseDeliveryTimeSlot = async (timeSlotId?: string) => {
  if (!timeSlotId) {
    return null;
  }

  return DeliveryTimeSlotModel.findOneAndUpdate(
    {
      _id: timeSlotId,
      currentOrders: { $gt: 0 }
    },
    { $inc: { currentOrders: -1 } },
    { new: true }
  );
};

export const assignShipment = async (orderId: string, payload: AssignShipmentInput) => {
  const [order, shipper] = await Promise.all([
    OrderModel.findById(orderId),
    ShipperModel.findById(payload.shipper)
  ]);

  if (!order) {
    throw new ApiError("Order not found", HTTP_STATUS.NOT_FOUND);
  }

  if (!shipper || shipper.status === SHIPPER_STATUSES.OFFLINE) {
    throw new ApiError("Shipper is not available", HTTP_STATUS.BAD_REQUEST);
  }

  const shipment = await ShipmentModel.findOneAndUpdate(
    { order: order._id },
    {
      order: order._id,
      shipper: shipper._id,
      address: order.address,
      timeSlot: order.timeSlot || undefined,
      shippingPartner: payload.shippingPartner,
      trackingCode: payload.trackingCode,
      status: SHIPMENT_STATUSES.ASSIGNED,
      note: payload.note
    },
    { new: true, upsert: true }
  ).populate("order shipper timeSlot");

  shipper.status = SHIPPER_STATUSES.BUSY;
  await shipper.save();

  return shipment;
};

export const getMyShipments = async (
  userId: string | Types.ObjectId,
  query: ShipperQuery
) => {
  const shipper = await ShipperModel.findOne({ user: userId });

  if (!shipper) {
    throw new ApiError("Shipper profile not found", HTTP_STATUS.NOT_FOUND);
  }

  return ShipmentModel.find({
    shipper: shipper._id,
    ...(query.status ? { status: query.status } : {})
  })
    .populate("order timeSlot")
    .sort({ createdAt: -1 });
};

export const updateMyShipmentStatus = async (
  userId: string | Types.ObjectId,
  shipmentId: string,
  payload: UpdateShipperShipmentStatusInput
) => {
  const shipper = await ShipperModel.findOne({ user: userId });

  if (!shipper) {
    throw new ApiError("Shipper profile not found", HTTP_STATUS.NOT_FOUND);
  }

  const shipment = await ShipmentModel.findOne({
    _id: shipmentId,
    shipper: shipper._id
  });

  if (!shipment) {
    throw new ApiError("Shipment not found", HTTP_STATUS.NOT_FOUND);
  }

  shipment.status = payload.status;
  shipment.note = payload.note ?? shipment.note;
  await shipment.save();

  if (payload.status === SHIPMENT_STATUSES.DELIVERED) {
    await OrderModel.findByIdAndUpdate(shipment.order, { status: ORDER_STATUS.COMPLETED });
    shipper.status = SHIPPER_STATUSES.AVAILABLE;
    await shipper.save();
  }

  if (payload.status === SHIPMENT_STATUSES.FAILED) {
    shipper.status = SHIPPER_STATUSES.AVAILABLE;
    await shipper.save();
  }

  return shipment.populate("order timeSlot");
};
