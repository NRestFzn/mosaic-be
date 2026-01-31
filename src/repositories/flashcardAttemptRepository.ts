import { Flashcard } from "../database/models/Flashcard.js";
import { FlashcardAttempt } from "../database/models/FlashcardAttempt.js";

export const flashcardAttemptRepository = {
  create(data: { userId: string; flashcardId: string; isCorrect: boolean }) {
    return FlashcardAttempt.create(data);
  },
  countByUserMaterial(userId: string, materialId: string) {
    return FlashcardAttempt.count({
      include: [{ model: Flashcard, where: { materialId }, required: true }],
      where: { userId }
    });
  },
  countCorrectByUserMaterial(userId: string, materialId: string) {
    return FlashcardAttempt.count({
      include: [{ model: Flashcard, where: { materialId }, required: true }],
      where: { userId, isCorrect: true }
    });
  }
};
