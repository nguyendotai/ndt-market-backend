import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import { getOrdersOverview } from "@/modules/orders/orders.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getOrders = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  res.status(HTTP_STATUS.OK).json(new ApiResponse(getOrdersOverview(), "Orders module ready"));
});
