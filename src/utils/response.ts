import { Response } from "express";

export const sendSuccess = <T>(res: Response, statusCode: number, message: string, data?: T) => {
  return res.status(statusCode).json({
    message,
    data: data ?? null,
    success: true,
    statusCode
  });
};

export const sendError = <T>(res: Response, statusCode: number, message: string, data?: T) => {
  return res.status(statusCode).json({
    message,
    data: data ?? null,
    success: false,
    statusCode
  });
};
