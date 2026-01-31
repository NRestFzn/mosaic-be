import { Quiz } from "../database/models/Quiz.js";
import { QuizAttempt } from "../database/models/QuizAttempt.js";

export const quizAttemptRepository = {
  create(data: { userId: string; quizId: string; selectedAnswer: string; isCorrect: boolean }) {
    return QuizAttempt.create(data);
  },
  countByUserMaterial(userId: string, materialId: string) {
    return QuizAttempt.count({
      include: [{ model: Quiz, where: { materialId }, required: true }],
      where: { userId }
    });
  },
  countCorrectByUserMaterial(userId: string, materialId: string) {
    return QuizAttempt.count({
      include: [{ model: Quiz, where: { materialId }, required: true }],
      where: { userId, isCorrect: true }
    });
  }
};
