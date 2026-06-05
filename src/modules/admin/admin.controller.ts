import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import { getAdminOverview } from "@/modules/admin/admin.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getAdmin = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  res.status(HTTP_STATUS.OK).json(new ApiResponse(getAdminOverview(), "Admin module ready"));
});
