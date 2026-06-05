import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import { getBannersOverview } from "@/modules/banners/banners.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getBanners = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  res.status(HTTP_STATUS.OK).json(new ApiResponse(getBannersOverview(), "Banners module ready"));
});
