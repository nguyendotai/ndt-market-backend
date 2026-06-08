import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import * as paymentService from "@/modules/payments/payments.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const createPayment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await paymentService.createPayment(String(req.params.orderCode), req.body);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(result, "Payment created successfully"));
});

export const getPaymentByOrderCode = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await paymentService.getPaymentByOrderCode(String(req.params.orderCode));

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Payment fetched successfully"));
});

export const handleMomoWebhook = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await paymentService.handleMomoWebhook(req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Momo webhook received"));
});

export const handleVnpayWebhook = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await paymentService.handleVnpayWebhook(req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "VNPAY webhook received"));
});

export const confirmPayment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await paymentService.confirmPayment(String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Payment confirmed successfully"));
});

export const refundPayment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await paymentService.refundPayment(String(req.params.id), req.body);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(result, "Payment refunded successfully"));
});
