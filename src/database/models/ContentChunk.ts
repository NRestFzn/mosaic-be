import { Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";

import { BaseModel } from "./BaseModel.js";
import { Material } from "./Material.js";

@Table({
  tableName: "content_chunks",
  timestamps: true
})
export class ContentChunk extends BaseModel {
  @ForeignKey(() => Material)
  @Column({ type: DataType.UUID, allowNull: false })
  declare materialId: string;

  @BelongsTo(() => Material)
  declare material?: any;

  @Column({ type: DataType.TEXT("long"), allowNull: false })
  declare content: string;

  @Column({ type: DataType.JSON, allowNull: true })
  declare embedding?: number[] | null;
}
