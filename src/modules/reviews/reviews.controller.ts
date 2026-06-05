import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";
import { getReviewsOverview } from "@/modules/reviews/reviews.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { catchAsync } from "@/utils/catchAsync";

export const getReviews = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  res.status(HTTP_STATUS.OK).json(new ApiResponse(getReviewsOverview(), "Reviews module ready"));
});
