import { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants";

export const getHealth = (_req: Request, res: Response): void => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "NDT Market API is healthy",
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
};
