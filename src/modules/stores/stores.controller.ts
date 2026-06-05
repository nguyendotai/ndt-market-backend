import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import { getStoresOverview } from "@/modules/stores/stores.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getStores = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  res.status(HTTP_STATUS.OK).json(new ApiResponse(getStoresOverview(), "Stores module ready"));
});
