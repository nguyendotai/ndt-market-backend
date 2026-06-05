import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import { getInventoriesOverview } from "@/modules/inventories/inventories.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getInventories = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  res.status(HTTP_STATUS.OK).json(new ApiResponse(getInventoriesOverview(), "Inventories module ready"));
});
