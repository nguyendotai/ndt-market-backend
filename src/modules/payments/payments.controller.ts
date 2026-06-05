import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import { getPaymentsOverview } from "@/modules/payments/payments.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getPayments = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  res.status(HTTP_STATUS.OK).json(new ApiResponse(getPaymentsOverview(), "Payments module ready"));
});
