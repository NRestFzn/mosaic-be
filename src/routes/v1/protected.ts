import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";

export const protectedRoutes = Router();

protectedRoutes.get(
  "/test",
  authenticate,
  asyncHandler((req, res) => {
    return sendSuccess(res, 200, "OK", { user: req.user });
  })
);
