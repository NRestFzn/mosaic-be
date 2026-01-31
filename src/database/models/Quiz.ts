import { Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";

import { BaseModel } from "./BaseModel.js";
import { Material } from "./Material.js";

@Table({
  tableName: "quizzes",
  timestamps: true
})
export class Quiz extends BaseModel {
  @ForeignKey(() => Material)
  @Column({ type: DataType.UUID, allowNull: false })
  declare materialId: string;

  @BelongsTo(() => Material)
  declare material?: any;

  @Column({ type: DataType.TEXT("long"), allowNull: false })
  declare question: string;

  @Column({ type: DataType.JSON, allowNull: false })
  declare options: string[];

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare answer: string;

  @Column({ type: DataType.TEXT("long"), allowNull: true })
  declare explanation?: string | null;

  @Column({ type: DataType.STRING(10), allowNull: false, defaultValue: "medium" })
  declare difficulty: "easy" | "medium" | "hard";
}
