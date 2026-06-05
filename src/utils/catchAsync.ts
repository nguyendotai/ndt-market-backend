import { NextFunction, Request, Response } from "express";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

export const catchAsync =
  (controller: AsyncController) =>
  (req: Request, res: Response, next: NextFunction): void => {
    void controller(req, res, next).catch(next);
  };
