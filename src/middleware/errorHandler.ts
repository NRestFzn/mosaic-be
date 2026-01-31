import { NextFunction, Request, Response } from "express";
import {
  DatabaseError,
  ForeignKeyConstraintError,
  UniqueConstraintError,
  ValidationError
} from "sequelize";
import { ZodError } from "zod";

import { AppError } from "../utils/appError.js";
import { sendError } from "../utils/response.js";

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message, err.code ? { code: err.code } : null);
  }

  if (err instanceof ZodError) {
    return sendError(res, 400, "Validation error", { errors: err.flatten() });
  }

  if (err instanceof UniqueConstraintError) {
    return sendError(res, 409, "Conflict", {
      errors: err.errors.map((item) => ({ message: item.message, path: item.path }))
    });
  }

  if (err instanceof ValidationError) {
    return sendError(res, 400, "Validation error", {
      errors: err.errors.map((item) => ({ message: item.message, path: item.path }))
    });
  }

  if (err instanceof ForeignKeyConstraintError) {
    return sendError(res, 400, "Invalid reference", {
      table: err.table,
      fields: err.fields
    });
  }

  if (err instanceof DatabaseError) {
    const dbCode = (err.original as { code?: string } | undefined)?.code;
    return sendError(res, 500, "Database error", { code: dbCode ?? "DB_ERROR" });
  }

  console.error("[error]", err);
  return sendError(res, 500, "Internal Server Error");
};
