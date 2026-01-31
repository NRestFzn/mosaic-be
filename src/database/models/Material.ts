import { Column, DataType, HasMany, Table, ForeignKey, BelongsTo } from "sequelize-typescript";

import { BaseModel } from "./BaseModel.js";
import { User } from "./User.js";
import { ContentChunk } from "./ContentChunk.js";
import { Summary } from "./Summary.js";
import { Flashcard } from "./Flashcard.js";
import { Quiz } from "./Quiz.js";

@Table({
  tableName: "materials",
  timestamps: true
})
export class Material extends BaseModel {
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @BelongsTo(() => User)
  declare user?: User;

  @Column({ type: DataType.STRING(200), allowNull: false })
  declare title: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare sourceType: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare originalFilename?: string | null;

  @Column({ type: DataType.TEXT("long"), allowNull: true })
  declare rawText?: string | null;

  @HasMany(() => ContentChunk)
  declare chunks?: ContentChunk[];

  @HasMany(() => Summary)
  declare summaries?: Summary[];

  @HasMany(() => Flashcard)
  declare flashcards?: Flashcard[];

  @HasMany(() => Quiz)
  declare quizzes?: Quiz[];
}
