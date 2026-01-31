import { Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";

import { BaseModel } from "./BaseModel.js";
import { User } from "./User.js";
import { Material } from "./Material.js";

@Table({
  tableName: "notifications",
  timestamps: true
})
export class Notification extends BaseModel {
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @BelongsTo(() => User)
  declare user?: User;

  @ForeignKey(() => Material)
  @Column({ type: DataType.UUID, allowNull: true })
  declare materialId?: string | null;

  @BelongsTo(() => Material)
  declare material?: Material;

  @Column({ type: DataType.STRING(200), allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT("long"), allowNull: true })
  declare body?: string | null;

  @Column({ type: DataType.DATE, allowNull: false })
  declare scheduledAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare sentAt?: Date | null;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: "pending" })
  declare status: string;
}
