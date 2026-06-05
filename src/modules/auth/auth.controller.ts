import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import { getAuthOverview } from "@/modules/auth/auth.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getAuth = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  res.status(HTTP_STATUS.OK).json(new ApiResponse(getAuthOverview(), "Auth module ready"));
});
