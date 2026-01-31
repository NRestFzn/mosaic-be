import { ComprehensionScore } from "../database/models/ComprehensionScore.js";
import { Material } from "../database/models/Material.js";

export const priorityService = {
  async getTopMaterials(userId: string, limit = 3) {
    const materials = await Material.findAll({ where: { userId } });
    const scores = await ComprehensionScore.findAll({ where: { userId } });

    const scoreMap = new Map(scores.map((s) => [s.materialId, s.score]));

    const ranked = materials
      .map((m) => ({ material: m, score: scoreMap.get(m.id) ?? 0 }))
      .sort((a, b) => a.score - b.score);

    return ranked.slice(0, limit).map((r) => r.material);
  }
};
