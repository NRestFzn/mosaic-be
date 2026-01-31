import { Summary } from "../database/models/Summary.js";

export const summaryRepository = {
  create(data: { materialId: string; content: string }) {
    return Summary.create(data);
  },
  findLatestByMaterialId(materialId: string) {
    return Summary.findOne({ where: { materialId }, order: [["createdAt", "DESC"]] });
  }
};
