import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import { getProductsOverview } from "@/modules/products/products.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getProducts = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  res.status(HTTP_STATUS.OK).json(new ApiResponse(getProductsOverview(), "Products module ready"));
});
