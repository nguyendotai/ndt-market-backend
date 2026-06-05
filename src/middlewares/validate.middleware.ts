import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    schema.parse({
      body: req.body,
      cookies: req.cookies,
      params: req.params,
      query: req.query
    });

    next();
  };
