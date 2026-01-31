import { Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";

import { BaseModel } from "./BaseModel.js";
import { User } from "./User.js";

@Table({
  tableName: "calendar_connections",
  timestamps: true
})
export class CalendarConnection extends BaseModel {
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @BelongsTo(() => User)
  declare user?: User;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare provider: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare accessToken?: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare refreshToken?: string | null;

  @Column({ type: DataType.BIGINT, allowNull: true })
  declare expiryDate?: number | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare scope?: string | null;

  @Column({ type: DataType.STRING(50), allowNull: true })
  declare tokenType?: string | null;
}
