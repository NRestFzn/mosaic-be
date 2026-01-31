import { Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";

import { BaseModel } from "./BaseModel.js";
import { Material } from "./Material.js";

@Table({
  tableName: "summaries",
  timestamps: true
})
export class Summary extends BaseModel {
  @ForeignKey(() => Material)
  @Column({ type: DataType.UUID, allowNull: false })
  declare materialId: string;

  @BelongsTo(() => Material)
  declare material?: Material;

  @Column({ type: DataType.TEXT("long"), allowNull: false })
  declare content: string;
}
