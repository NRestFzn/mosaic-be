import { Material } from "../database/models/Material.js";

export const materialRepository = {
  create(data: {
    userId: string;
    title: string;
    sourceType: string;
    originalFilename?: string | null;
    rawText?: string | null;
  }) {
    return Material.create(data);
  },
  findById(id: string) {
    return Material.findByPk(id);
  },
  findByUserId(userId: string) {
    return Material.findAll({ where: { userId }, order: [["createdAt", "DESC"]] });
  }
};
