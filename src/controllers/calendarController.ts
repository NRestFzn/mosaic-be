import { Request, Response } from "express";

import { googleCalendarService } from "../services/googleCalendarService.js";
import { scheduleService } from "../services/scheduleService.js";
import { sendError, sendSuccess } from "../utils/response.js";

export const getGoogleAuthUrl = async (req: Request, res: Response) => {
  const url = googleCalendarService.getAuthUrl(req.user!.id);
  return sendSuccess(res, 200, "Google auth url", { url });
};

export const handleGoogleCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query as { code?: string; state?: string };
  if (!code || !state) {
    return sendError(res, 400, "Missing code or state");
  }

  await googleCalendarService.handleCallback(code, state);
  return sendSuccess(res, 200, "Google Calendar connected", null);
};

export const getFreeSlots = async (req: Request, res: Response) => {
  const { start, end, minMinutes } = req.query as {
    start: string;
    end: string;
    minMinutes?: string;
  };

  const result = await googleCalendarService.getFreeSlots(
    req.user!.id,
    start,
    end,
    minMinutes ? Number(minMinutes) : 15
  );

  const slots = await scheduleService.attachActivities(req.user!.id, result.free);

  return sendSuccess(res, 200, "Free slots", { ...result, slots });
};
