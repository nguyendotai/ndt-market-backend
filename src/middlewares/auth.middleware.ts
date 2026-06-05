import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "@/configs/env";
import { HTTP_STATUS } from "@/constants";
import { ApiError } from "@/utils/ApiError";

export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    next(new ApiError("Authentication token is required", HTTP_STATUS.UNAUTHORIZED));
    return;
  }

  try {
    jwt.verify(token, env.JWT_ACCESS_SECRET);
    next();
  } catch {
    next(new ApiError("Invalid or expired authentication token", HTTP_STATUS.UNAUTHORIZED));
  }
};
