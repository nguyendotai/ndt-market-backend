import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as deliveryService from "@/modules/delivery/delivery.service";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

const getUserId = (req: Request) => {
  if (!req.user) {
    throw new ApiError("Authentication is required", HTTP_STATUS.UNAUTHORIZED);
  }

  return req.user._id;
};

export const getDeliveryTimeSlots = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await deliveryService.getDeliveryTimeSlots(req.query as never);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Delivery time slots fetched successfully"));
});

export const createDeliveryTimeSlot = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await deliveryService.createDeliveryTimeSlot(req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Delivery time slot created successfully"));
});

export const updateDeliveryTimeSlot = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await deliveryService.updateDeliveryTimeSlot(String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Delivery time slot updated successfully"));
});

export const assignShipment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await deliveryService.assignShipment(String(req.params.orderId), req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Shipment assigned successfully"));
});

export const getMyShipments = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await deliveryService.getMyShipments(getUserId(req), req.query as never);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Shipments fetched successfully"));
});

export const updateMyShipmentStatus = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await deliveryService.updateMyShipmentStatus(
    getUserId(req),
    String(req.params.id),
    req.body
  );

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Shipment status updated successfully"));
});
