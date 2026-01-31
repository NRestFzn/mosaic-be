import { Quiz } from "../database/models/Quiz.js";
import { QuizAttempt } from "../database/models/QuizAttempt.js";

export const quizRepository = {
  bulkCreate(
    items: {
      materialId: string;
      question: string;
      options: string[];
      answer: string;
      explanation?: string | null;
      difficulty: "easy" | "medium" | "hard";
    }[]
  ) {
    return Quiz.bulkCreate(items);
  },
  findById(id: string) {
    return Quiz.findByPk(id);
  },
  findByMaterialId(materialId: string) {
    return Quiz.findAll({ where: { materialId }, order: [["createdAt", "ASC"]] });
  },
  countByMaterialId(materialId: string) {
    return Quiz.count({ where: { materialId } });
  },
  countAttemptedDistinctByUserMaterial(userId: string, materialId: string) {
    return QuizAttempt.count({
      distinct: true,
      col: "quizId",
      include: [{ model: Quiz, where: { materialId }, required: true }],
      where: { userId }
    });
  }
};
