import { Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";

import { BaseModel } from "./BaseModel.js";
import { User } from "./User.js";
import { Flashcard } from "./Flashcard.js";

@Table({
  tableName: "flashcard_attempts",
  timestamps: true
})
export class FlashcardAttempt extends BaseModel {
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @BelongsTo(() => User)
  declare user?: User;

  @ForeignKey(() => Flashcard)
  @Column({ type: DataType.UUID, allowNull: false })
  declare flashcardId: string;

  @BelongsTo(() => Flashcard)
  declare flashcard?: Flashcard;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare isCorrect: boolean;
}
