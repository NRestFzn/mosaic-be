import { Request, Response } from "express";

import { healthService } from "../services/healthService.js";
import { sendSuccess } from "../utils/response.js";

export const getHealth = (_req: Request, res: Response) => {
  const data = healthService.getHealth();
  return sendSuccess(res, 200, "OK", data);
};
