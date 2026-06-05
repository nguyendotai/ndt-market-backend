import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import { getArticlesOverview } from "@/modules/articles/articles.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getArticles = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  res.status(HTTP_STATUS.OK).json(new ApiResponse(getArticlesOverview(), "Articles module ready"));
});
