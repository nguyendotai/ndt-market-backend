import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import { getUsersOverview } from "@/modules/users/users.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getUsers = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  res.status(HTTP_STATUS.OK).json(new ApiResponse(getUsersOverview(), "Users module ready"));
});
