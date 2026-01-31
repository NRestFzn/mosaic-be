import { Request, Response } from "express";

import { notificationRepository } from "../repositories/notificationRepository.js";
import { sendSuccess } from "../utils/response.js";

export const listNotifications = async (req: Request, res: Response) => {
  const { status } = req.query as { status?: string };
  const items = await notificationRepository.findByUser(req.user!.id, status);
  return sendSuccess(res, 200, "Notifications", items);
};

export const markNotificationRead = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  await notificationRepository.markSent(id, req.user!.id);
  return sendSuccess(res, 200, "Notification updated", null);
};
