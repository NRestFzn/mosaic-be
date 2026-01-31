import { CalendarConnection } from "../database/models/CalendarConnection.js";

export const calendarConnectionRepository = {
  findByUserAndProvider(userId: string, provider: string) {
    return CalendarConnection.findOne({ where: { userId, provider } });
  },
  async upsert(data: {
    userId: string;
    provider: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    expiryDate?: number | null;
    scope?: string | null;
    tokenType?: string | null;
  }) {
    const existing = await CalendarConnection.findOne({
      where: { userId: data.userId, provider: data.provider }
    });

    if (existing) {
      return existing.update(data);
    }

    return CalendarConnection.create(data);
  }
};
