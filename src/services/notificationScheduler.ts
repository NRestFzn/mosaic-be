import cron from "node-cron";

import { CalendarConnection } from "../database/models/CalendarConnection.js";
import { Notification } from "../database/models/Notification.js";
import { calendarConnectionRepository } from "../repositories/calendarConnectionRepository.js";
import { notificationRepository } from "../repositories/notificationRepository.js";
import { googleCalendarService } from "./googleCalendarService.js";
import { priorityService } from "./priorityService.js";

const MIN_SLOT_MINUTES = 1;
const LOOKAHEAD_MINUTES = 90;

const scheduleForUser = async (userId: string) => {
  const now = new Date();
  const end = new Date(now.getTime() + LOOKAHEAD_MINUTES * 60 * 1000);

  const { free } = await googleCalendarService.getFreeSlots(
    userId,
    now.toISOString(),
    end.toISOString(),
    MIN_SLOT_MINUTES
  );

  if (!free.length) return;

  const topMaterials = await priorityService.getTopMaterials(userId, 1);
  const material = topMaterials[0];

  const nextSlot = free[0];
  const scheduledAt = new Date(nextSlot.start);

  const existing = await Notification.findOne({
    where: { userId, scheduledAt, status: "pending" }
  });

  if (existing) return;

  await notificationRepository.create({
    userId,
    materialId: material?.id ?? null,
    title: "You have free time to learn",
    body: material ? `Continue: ${material.title}` : "Open Mosaic to start learning",
    scheduledAt
  });
};

const notifyPending = async () => {
  const pending = await notificationRepository.findPendingWithin(LOOKAHEAD_MINUTES);
  for (const notif of pending) {
    // TODO: push notification integration
    await notificationRepository.markSent(notif.id, notif.userId);
  }
};

export const startNotificationScheduler = () => {
  cron.schedule("*/15 * * * *", async () => {
    const connections = await CalendarConnection.findAll({ where: { provider: "google" } });
    for (const conn of connections) {
      await scheduleForUser(conn.userId);
    }

    await notifyPending();
  });
};
