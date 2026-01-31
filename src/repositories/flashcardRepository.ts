import { col, fn } from "sequelize";

import { Flashcard } from "../database/models/Flashcard.js";
import { FlashcardAttempt } from "../database/models/FlashcardAttempt.js";

export const flashcardRepository = {
  bulkCreate(items: { materialId: string; front: string; back: string; correctAnswer: boolean }[]) {
    return Flashcard.bulkCreate(items);
  },
  findByMaterialId(materialId: string) {
    return Flashcard.findAll({ where: { materialId }, order: [["createdAt", "ASC"]] });
  },
  countByMaterialId(materialId: string) {
    return Flashcard.count({ where: { materialId } });
  },
  countAttemptedDistinctByUserMaterial(userId: string, materialId: string) {
    return FlashcardAttempt.count({
      distinct: true,
      col: "flashcardId",
      include: [{ model: Flashcard, where: { materialId }, required: true }],
      where: { userId }
    });
  },
  findById(id: string) {
    return Flashcard.findByPk(id);
  }
};
