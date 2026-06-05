import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { logger } from "@/configs/logger";
import { HTTP_STATUS } from "@/constants";
import { ApiError } from "@/utils/ApiError";

type ErrorResponse = {
  success: false;
  message: string;
  errors?: unknown;
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof ZodError) {
    const response: ErrorResponse = {
      success: false,
      message: "Validation failed",
      errors: error.flatten()
    };

    res.status(HTTP_STATUS.BAD_REQUEST).json(response);
    return;
  }

  if (error instanceof ApiError) {
    const response: ErrorResponse = {
      success: false,
      message: error.message
    };

    res.status(error.statusCode).json(response);
    return;
  }

  logger.error("Unhandled error", error);

  const response: ErrorResponse = {
    success: false,
    message: "Internal server error"
  };

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
};
