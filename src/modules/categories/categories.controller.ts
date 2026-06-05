import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import { getCategoriesOverview } from "@/modules/categories/categories.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getCategories = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  res.status(HTTP_STATUS.OK).json(new ApiResponse(getCategoriesOverview(), "Categories module ready"));
});
