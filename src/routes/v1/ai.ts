import { Router } from "express";

import {
  createMaterial,
  uploadMaterial,
  generateFlashcards,
  generateQuiz,
  generateSummary,
  submitFlashcardAttempt,
  submitQuizAttempt
} from "../../controllers/aiController.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { authenticate } from "../../middleware/authenticate.js";
import { upload } from "../../middleware/upload.js";
import { validateBody } from "../../middleware/validateBody.js";
import {
  createMaterialSchema,
  flashcardAttemptSchema,
  generateFlashcardsSchema,
  generateQuizSchema,
  generateSummarySchema,
  quizAttemptSchema
} from "../../validators/aiSchemas.js";

export const aiRoutes = Router();

aiRoutes.post(
  "/materials",
  authenticate,
  validateBody(createMaterialSchema),
  asyncHandler(createMaterial)
);
aiRoutes.post(
  "/materials/upload",
  authenticate,
  upload.single("file"),
  asyncHandler(uploadMaterial)
);
aiRoutes.post(
  "/materials/summary",
  authenticate,
  validateBody(generateSummarySchema),
  asyncHandler(generateSummary)
);
aiRoutes.post(
  "/materials/flashcards",
  authenticate,
  validateBody(generateFlashcardsSchema),
  asyncHandler(generateFlashcards)
);
aiRoutes.post(
  "/materials/quiz",
  authenticate,
  validateBody(generateQuizSchema),
  asyncHandler(generateQuiz)
);
aiRoutes.post(
  "/materials/:materialId/flashcards/attempts",
  authenticate,
  validateBody(flashcardAttemptSchema),
  asyncHandler(submitFlashcardAttempt)
);
aiRoutes.post(
  "/materials/:materialId/quizzes/attempts",
  authenticate,
  validateBody(quizAttemptSchema),
  asyncHandler(submitQuizAttempt)
);
