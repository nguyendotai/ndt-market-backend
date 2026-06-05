import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import { getPromotionsOverview } from "@/modules/promotions/promotions.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getPromotions = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  res.status(HTTP_STATUS.OK).json(new ApiResponse(getPromotionsOverview(), "Promotions module ready"));
});
