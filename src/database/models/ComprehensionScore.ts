import { Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";

import { BaseModel } from "./BaseModel.js";
import { User } from "./User.js";
import { Material } from "./Material.js";

@Table({
  tableName: "comprehension_scores",
  timestamps: true
})
export class ComprehensionScore extends BaseModel {
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @BelongsTo(() => User)
  declare user?: User;

  @ForeignKey(() => Material)
  @Column({ type: DataType.UUID, allowNull: false })
  declare materialId: string;

  @BelongsTo(() => Material)
  declare material?: Material;

  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
  declare score: number;
}
