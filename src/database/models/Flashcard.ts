import { Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";

import { BaseModel } from "./BaseModel.js";
import { Material } from "./Material.js";

@Table({
  tableName: "flashcards",
  timestamps: true
})
export class Flashcard extends BaseModel {
  @ForeignKey(() => Material)
  @Column({ type: DataType.UUID, allowNull: false })
  declare materialId: string;

  @BelongsTo(() => Material)
  declare material?: Material;

  @Column({ type: DataType.TEXT("long"), allowNull: false })
  declare front: string;

  @Column({ type: DataType.TEXT("long"), allowNull: false })
  declare back: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare correctAnswer: boolean;
}
