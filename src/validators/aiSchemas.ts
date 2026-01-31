import { z } from "zod";

export const createMaterialSchema = z.object({
  title: z.string().min(1).max(200),
  sourceType: z.string().min(1).max(50),
  originalFilename: z.string().max(255).optional(),
  rawText: z.string().min(1).optional()
});

export const generateSummarySchema = z.object({
  materialId: z.string().uuid()
});

export const generateFlashcardsSchema = z.object({
  materialId: z.string().uuid(),
  count: z.number().int().min(1).max(50).optional()
});

export const generateQuizSchema = z.object({
  materialId: z.string().uuid(),
  count: z.number().int().min(1).max(50).optional()
});

export const flashcardAttemptSchema = z.object({
  flashcardId: z.string().uuid(),
  selectedAnswer: z.boolean()
});

export const quizAttemptSchema = z.object({
  quizId: z.string().uuid(),
  selectedAnswer: z.string().min(1)
});
