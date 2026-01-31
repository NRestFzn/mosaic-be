import { ContentChunk } from "../database/models/ContentChunk.js";

export const contentChunkRepository = {
  bulkCreate(chunks: { materialId: string; content: string; embedding?: number[] | null }[]) {
    return ContentChunk.bulkCreate(chunks);
  },
  findByMaterialId(materialId: string) {
    return ContentChunk.findAll({ where: { materialId } });
  }
};
