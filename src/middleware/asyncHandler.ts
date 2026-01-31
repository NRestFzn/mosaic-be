import type { NextFunction, Request, RequestHandler, Response } from "express";

export const asyncHandler = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown
) => {
  const wrapped: RequestHandler = (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };

  return wrapped;
};
