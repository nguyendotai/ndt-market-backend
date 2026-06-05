import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
};
