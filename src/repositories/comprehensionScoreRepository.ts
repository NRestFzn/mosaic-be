import { ComprehensionScore } from "../database/models/ComprehensionScore.js";

export const comprehensionScoreRepository = {
  async upsert(data: { userId: string; materialId: string; score: number }) {
    const existing = await ComprehensionScore.findOne({
      where: { userId: data.userId, materialId: data.materialId }
    });

    if (existing) {
      existing.score = data.score;
      return existing.save();
    }

    return ComprehensionScore.create(data);
  }
};
