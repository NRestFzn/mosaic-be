import { Request, Response } from "express";

import { aiService } from "../services/aiService.js";
import { sendSuccess } from "../utils/response.js";
import { AppError } from "../utils/appError.js";

export const createMaterial = async (req: Request, res: Response) => {
  const { title, sourceType, originalFilename, rawText } = req.body as {
    title: string;
    sourceType: string;
    originalFilename?: string;
    rawText?: string;
  };

  const material = await aiService.createMaterial({
    userId: req.user!.id,
    title,
    sourceType,
    originalFilename,
    rawText
  });

  return sendSuccess(res, 201, "Material created", material);
};

export const uploadMaterial = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    throw AppError.badRequest("File is required");
  }

  const { title } = req.body as { title: string };
  if (!title) {
    throw AppError.badRequest("Title is required");
  }

  const material = await aiService.createMaterialFromFile({
    userId: req.user!.id,
    title,
    originalFilename: file.originalname,
    buffer: file.buffer,
    mimetype: file.mimetype
  });

  return sendSuccess(res, 201, "Material uploaded", material);
};

export const generateSummary = async (req: Request, res: Response) => {
  const { materialId } = req.body as { materialId: string };
  const summary = await aiService.generateSummary(materialId);
  return sendSuccess(res, 200, "Summary generated", summary);
};

export const generateFlashcards = async (req: Request, res: Response) => {
  const { materialId, count } = req.body as { materialId: string; count?: number };
  const cards = await aiService.generateFlashcards(materialId, count);
  return sendSuccess(res, 200, "Flashcards generated", cards);
};

export const generateQuiz = async (req: Request, res: Response) => {
  const { materialId, count } = req.body as { materialId: string; count?: number };
  const quiz = await aiService.generateQuiz(materialId, count);
  return sendSuccess(res, 200, "Quiz generated", quiz);
};

export const submitFlashcardAttempt = async (req: Request, res: Response) => {
  const { materialId } = req.params as { materialId: string };
  const { flashcardId, selectedAnswer } = req.body as {
    flashcardId: string;
    selectedAnswer: boolean;
  };
  const score = await aiService.recordFlashcardAttempt({
    userId: req.user!.id,
    materialId,
    flashcardId,
    selectedAnswer
  });
  return sendSuccess(res, 200, "Flashcard attempt recorded", score);
};

export const submitQuizAttempt = async (req: Request, res: Response) => {
  const { materialId } = req.params as { materialId: string };
  const { quizId, selectedAnswer } = req.body as { quizId: string; selectedAnswer: string };
  const score = await aiService.recordQuizAttempt({
    userId: req.user!.id,
    materialId,
    quizId,
    selectedAnswer
  });
  return sendSuccess(res, 200, "Quiz attempt recorded", score);
};

export const listMaterials = async (req: Request, res: Response) => {
  const data = await aiService.listMaterialsWithProgress(req.user!.id);
  return sendSuccess(res, 200, "Materials", data);
};
