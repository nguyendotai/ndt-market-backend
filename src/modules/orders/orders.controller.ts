import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as orderService from "@/modules/orders/orders.service";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

const getUserId = (req: Request) => {
  if (!req.user) {
    throw new ApiError("Authentication is required", HTTP_STATUS.UNAUTHORIZED);
  }

  return req.user._id;
};

export const checkout = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await orderService.checkout(getUserId(req), req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Checkout successfully"));
});

export const getOrders = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await orderService.getMyOrders(getUserId(req));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Orders fetched successfully"));
});

export const getOrderByCode = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await orderService.getMyOrderByCode(getUserId(req), String(req.params.orderCode));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Order fetched successfully"));
});

export const cancelOrder = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await orderService.cancelMyOrder(
    getUserId(req),
    String(req.params.orderCode),
    req.body
  );

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Order cancelled successfully"));
});

export const getAdminOrders = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await orderService.getAdminOrders(req.query as never);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Orders fetched successfully"));
});

export const getAdminOrderById = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await orderService.getAdminOrderById(String(req.params.id));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Order fetched successfully"));
});

export const updateOrderStatus = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await orderService.updateOrderStatus(
    String(req.params.id),
    req.body,
    getUserId(req)
  );

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Order status updated successfully"));
});
