import { Router } from "express";

import { login, register } from "../../controllers/authController.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { validateBody } from "../../middleware/validateBody.js";
import { loginSchema, registerSchema } from "../../validators/authSchemas.js";

export const authRoutes = Router();

authRoutes.post("/register", validateBody(registerSchema), asyncHandler(register));
authRoutes.post("/login", validateBody(loginSchema), asyncHandler(login));
