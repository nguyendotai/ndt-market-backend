import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { HTTP_STATUS } from "@/constants";
import { logger } from "@/configs/logger";
import { ApiError } from "@/utils/ApiError";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof ZodError) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "Validation failed",
      errors: error.flatten()
    });
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
    return;
  }

  logger.error("Unhandled error", error);

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal server error"
  });
};
