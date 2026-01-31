import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      throw result.error;
    }

    req.query = result.data as typeof req.query;
    return next();
  };
};
