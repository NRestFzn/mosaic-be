import { Router } from "express";

import { authRoutes } from "./auth.js";
import { healthRoutes } from "./health.js";
import { protectedRoutes } from "./protected.js";

export const v1Routes = Router();

v1Routes.use("/health", healthRoutes);
v1Routes.use("/auth", authRoutes);
v1Routes.use("/protected", protectedRoutes);
