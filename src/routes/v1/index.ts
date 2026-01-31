import { Router } from "express";

import { aiRoutes } from "./ai.js";
import { authRoutes } from "./auth.js";
import { calendarRoutes } from "./calendar.js";
import { healthRoutes } from "./health.js";
import { notificationRoutes } from "./notifications.js";
import { protectedRoutes } from "./protected.js";

export const v1Routes = Router();

v1Routes.use("/health", healthRoutes);
v1Routes.use("/auth", authRoutes);
v1Routes.use("/protected", protectedRoutes);
v1Routes.use("/ai", aiRoutes);
v1Routes.use("/calendar", calendarRoutes);
v1Routes.use("/notifications", notificationRoutes);
