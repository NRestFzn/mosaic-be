import { Router } from "express";

import {
  listNotifications,
  markNotificationRead
} from "../../controllers/notificationController.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { authenticate } from "../../middleware/authenticate.js";

export const notificationRoutes = Router();

notificationRoutes.get("/", authenticate, asyncHandler(listNotifications));
notificationRoutes.patch("/:id/read", authenticate, asyncHandler(markNotificationRead));
