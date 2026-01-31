import { Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";

import { BaseModel } from "./BaseModel.js";
import { User } from "./User.js";
import { Quiz } from "./Quiz.js";

@Table({
  tableName: "quiz_attempts",
  timestamps: true
})
export class QuizAttempt extends BaseModel {
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @BelongsTo(() => User)
  declare user?: User;

  @ForeignKey(() => Quiz)
  @Column({ type: DataType.UUID, allowNull: false })
  declare quizId: string;

  @BelongsTo(() => Quiz)
  declare quiz?: Quiz;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare selectedAnswer: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare isCorrect: boolean;
}
