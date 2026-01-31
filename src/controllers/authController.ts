import { Request, Response } from "express";

import type { LoginRequestDto, RegisterRequestDto } from "../types/dto/auth.js";

import { authService } from "../services/authService.js";
import { sendSuccess } from "../utils/response.js";

export const register = async (req: Request, res: Response) => {
  const { fullname, email, password } = req.body as RegisterRequestDto;

  const result = await authService.register({ fullname, email, password });
  return sendSuccess(res, 201, "Registered", result);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginRequestDto;

  const result = await authService.login({ email, password });
  return sendSuccess(res, 200, "Logged in", result);
};
