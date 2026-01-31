export type MaterialCreateDto = {
  title: string;
  sourceType: string;
  originalFilename?: string | null;
  rawText?: string | null;
};

export type MaterialDto = MaterialCreateDto & {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type SummaryDto = {
  id: string;
  materialId: string;
  content: string;
  createdAt: string;
};

export type FlashcardDto = {
  id: string;
  materialId: string;
  front: string;
  back: string;
  correctAnswer: boolean;
  createdAt: string;
};

export type QuizDto = {
  id: string;
  materialId: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string | null;
  createdAt: string;
};

export type FlashcardAttemptDto = {
  id: string;
  flashcardId: string;
  userId: string;
  isCorrect: boolean;
  createdAt: string;
};

export type QuizAttemptDto = {
  id: string;
  quizId: string;
  userId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  createdAt: string;
};

export type ComprehensionScoreDto = {
  id: string;
  userId: string;
  materialId: string;
  score: number;
  createdAt: string;
  updatedAt: string;
};

export type GenerateSummaryRequestDto = {
  materialId: string;
};

export type GenerateFlashcardsRequestDto = {
  materialId: string;
  count?: number;
};

export type GenerateQuizRequestDto = {
  materialId: string;
  count?: number;
};
