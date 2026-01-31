import { google } from "googleapis";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";
import { calendarConnectionRepository } from "../repositories/calendarConnectionRepository.js";
import { computeFreeSlots } from "../utils/time.js";

const requireOAuth = () => {
  if (
    !env.GOOGLE_OAUTH_CLIENT_ID ||
    !env.GOOGLE_OAUTH_CLIENT_SECRET ||
    !env.GOOGLE_OAUTH_REDIRECT_URI
  ) {
    throw AppError.internal("Google OAuth not configured");
  }

  return {
    clientId: env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
    redirectUri: env.GOOGLE_OAUTH_REDIRECT_URI
  };
};

const createOAuthClient = () => {
  const { clientId, clientSecret, redirectUri } = requireOAuth();
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
};

const signState = (userId: string) => {
  return jwt.sign({ sub: userId, purpose: "google_calendar" }, env.JWT_SECRET, {
    expiresIn: "10m"
  });
};

const verifyState = (state: string) => {
  const payload = jwt.verify(state, env.JWT_SECRET) as { sub: string; purpose: string };
  if (payload.purpose !== "google_calendar") {
    throw AppError.unauthorized("Invalid state");
  }
  return payload.sub;
};

const attachTokenListener = (oauth2: ReturnType<typeof createOAuthClient>, userId: string) => {
  oauth2.on("tokens", async (tokens) => {
    if (!tokens.access_token && !tokens.refresh_token) return;

    await calendarConnectionRepository.upsert({
      userId,
      provider: "google",
      accessToken: tokens.access_token ?? undefined,
      refreshToken: tokens.refresh_token ?? undefined,
      expiryDate: tokens.expiry_date ?? undefined,
      scope: tokens.scope ?? undefined,
      tokenType: tokens.token_type ?? undefined
    });
  });
};

export const googleCalendarService = {
  getAuthUrl(userId: string) {
    const oauth2 = createOAuthClient();
    return oauth2.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["https://www.googleapis.com/auth/calendar.readonly"],
      state: signState(userId)
    });
  },

  async handleCallback(code: string, state: string) {
    const oauth2 = createOAuthClient();
    const userId = verifyState(state);

    attachTokenListener(oauth2, userId);
    const { tokens } = await oauth2.getToken(code);

    await calendarConnectionRepository.upsert({
      userId,
      provider: "google",
      accessToken: tokens.access_token ?? null,
      refreshToken: tokens.refresh_token ?? null,
      expiryDate: tokens.expiry_date ?? null,
      scope: tokens.scope ?? null,
      tokenType: tokens.token_type ?? null
    });

    return { userId };
  },

  async getFreeSlots(userId: string, start: string, end: string, minMinutes = 15) {
    const connection = await calendarConnectionRepository.findByUserAndProvider(userId, "google");
    if (!connection?.accessToken) {
      throw AppError.notFound("Google Calendar not connected");
    }

    const oauth2 = createOAuthClient();
    attachTokenListener(oauth2, userId);
    oauth2.setCredentials({
      access_token: connection.accessToken,
      refresh_token: connection.refreshToken ?? undefined
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2 });

    const freeBusy = await calendar.freebusy.query({
      requestBody: {
        timeMin: start,
        timeMax: end,
        items: [{ id: "primary" }]
      }
    });

    const events = await calendar.events.list({
      calendarId: "primary",
      timeMin: start,
      timeMax: end,
      singleEvents: true,
      orderBy: "startTime"
    });

    const busy = freeBusy.data.calendars?.primary?.busy ?? [];
    const free = computeFreeSlots(start, end, busy as { start: string; end: string }[], minMinutes);

    const busyDetailed = (events.data.items ?? []).map((item) => ({
      id: item.id ?? null,
      title: item.summary ?? null,
      location: item.location ?? null,
      start: item.start?.dateTime ?? item.start?.date ?? null,
      end: item.end?.dateTime ?? item.end?.date ?? null
    }));

    return { busy: busyDetailed, free };
  }
};
