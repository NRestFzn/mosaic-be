import { Router } from "express";

import {
  getFreeSlots,
  getGoogleAuthUrl,
  handleGoogleCallback
} from "../../controllers/calendarController.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { authenticate } from "../../middleware/authenticate.js";
import { validateQuery } from "../../middleware/validateQuery.js";
import { freeSlotsQuerySchema } from "../../validators/calendarSchemas.js";

export const calendarRoutes = Router();

calendarRoutes.get("/google/auth-url", authenticate, asyncHandler(getGoogleAuthUrl));
calendarRoutes.get("/google/callback", asyncHandler(handleGoogleCallback));
calendarRoutes.get(
  "/google/free-slots",
  authenticate,
  validateQuery(freeSlotsQuerySchema),
  asyncHandler(getFreeSlots)
);
