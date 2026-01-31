import { ComprehensionScore } from "./ComprehensionScore.js";
import { CalendarConnection } from "./CalendarConnection.js";
import { Notification } from "./Notification.js";
import { ContentChunk } from "./ContentChunk.js";
import { Flashcard } from "./Flashcard.js";
import { FlashcardAttempt } from "./FlashcardAttempt.js";
import { Material } from "./Material.js";
import { Quiz } from "./Quiz.js";
import { QuizAttempt } from "./QuizAttempt.js";
import { Summary } from "./Summary.js";
import { User } from "./User.js";

export const models = [
  User,
  Material,
  ContentChunk,
  Summary,
  Flashcard,
  Quiz,
  FlashcardAttempt,
  QuizAttempt,
  ComprehensionScore,
  CalendarConnection,
  Notification
];
