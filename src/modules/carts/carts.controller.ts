import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import { getCartsOverview } from "@/modules/carts/carts.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getCarts = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  res.status(HTTP_STATUS.OK).json(new ApiResponse(getCartsOverview(), "Carts module ready"));
});
