import { NextFunction, Request, Response } from "express";
import { z, ZodTypeAny } from "zod";

type RequestValidationSchema = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

export const validate =
  (schema: RequestValidationSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const validator = z.object({
      body: schema.body ?? z.any(),
      params: schema.params ?? z.any(),
      query: schema.query ?? z.any()
    });

    validator.parse({
      body: req.body ?? {},
      params: req.params,
      query: req.query
    });

    next();
  };
