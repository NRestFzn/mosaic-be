import { Op } from "sequelize";

import { Notification } from "../database/models/Notification.js";

export const notificationRepository = {
  create(data: {
    userId: string;
    materialId?: string | null;
    title: string;
    body?: string | null;
    scheduledAt: Date;
  }) {
    return Notification.create(data);
  },
  markSent(id: string, userId: string) {
    return Notification.update({ status: "sent", sentAt: new Date() }, { where: { id, userId } });
  },
  findByUser(userId: string, status?: string) {
    return Notification.findAll({
      where: {
        userId,
        ...(status ? { status } : {})
      },
      order: [["createdAt", "DESC"]]
    });
  },
  findPendingWithin(minutesAhead: number) {
    const now = new Date();
    const future = new Date(now.getTime() + minutesAhead * 60 * 1000);
    return Notification.findAll({
      where: {
        status: "pending",
        scheduledAt: { [Op.lte]: future, [Op.gte]: now }
      }
    });
  }
};
