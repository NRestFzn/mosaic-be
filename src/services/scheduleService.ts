import { aiService } from "./aiService.js";

type FreeSlot = { start: string; end: string };

type ActivityType = "flashcard" | "quiz";

type Activity = {
  type: ActivityType;
  materialId: string;
  title: string;
  progress: number;
} | null;

const toMinutes = (start: string, end: string) => {
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  return Math.max(0, Math.round((endMs - startMs) / 60000));
};

export const scheduleService = {
  async attachActivities(userId: string, freeSlots: FreeSlot[]) {
    const materials = await aiService.listMaterialsWithProgress(userId);

    const flashCandidates = materials
      .filter((m) => m.progress.flashcard.progress < 100)
      .sort((a, b) => a.progress.flashcard.progress - b.progress.flashcard.progress);

    const quizCandidates = materials
      .filter((m) => m.progress.quiz.progress < 100)
      .sort((a, b) => a.progress.quiz.progress - b.progress.quiz.progress);

    let flashIndex = 0;
    let quizIndex = 0;

    const pick = (type: ActivityType): Activity => {
      const list = type === "flashcard" ? flashCandidates : quizCandidates;
      if (list.length === 0) return null;

      const idx = type === "flashcard" ? flashIndex++ : quizIndex++;
      const item = list[idx % list.length];
      return {
        type,
        materialId: item.material.id,
        title: item.material.title,
        progress:
          type === "flashcard" ? item.progress.flashcard.progress : item.progress.quiz.progress
      };
    };

    return freeSlots.map((slot) => {
      const durationMinutes = toMinutes(slot.start, slot.end);
      const type: ActivityType = durationMinutes <= 60 ? "flashcard" : "quiz";
      const activity = pick(type);

      return {
        start: slot.start,
        end: slot.end,
        durationMinutes,
        activity
      };
    });
  }
};
