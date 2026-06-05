import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import { getBrandsOverview } from "@/modules/brands/brands.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getBrands = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  res.status(HTTP_STATUS.OK).json(new ApiResponse(getBrandsOverview(), "Brands module ready"));
});
