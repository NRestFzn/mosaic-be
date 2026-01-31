import { Column, DataType, Table } from "sequelize-typescript";

import { BaseModel } from "./BaseModel.js";

@Table({
  tableName: "users",
  timestamps: true
})
export class User extends BaseModel {
  @Column({ type: DataType.STRING(150), allowNull: false })
  declare fullname: string;

  @Column({ type: DataType.STRING(150), allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare password: string;
}
