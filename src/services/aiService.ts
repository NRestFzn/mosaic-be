import { GoogleGenerativeAI } from "@google/generative-ai";

import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";
import { extractTextFromFile } from "../utils/file.js";
import { chunkText } from "../utils/text.js";
import { extractJson } from "../utils/json.js";
import { contentChunkRepository } from "../repositories/contentChunkRepository.js";
import { flashcardAttemptRepository } from "../repositories/flashcardAttemptRepository.js";
import { flashcardRepository } from "../repositories/flashcardRepository.js";
import { materialRepository } from "../repositories/materialRepository.js";
import { quizAttemptRepository } from "../repositories/quizAttemptRepository.js";
import { quizRepository } from "../repositories/quizRepository.js";
import { summaryRepository } from "../repositories/summaryRepository.js";
import { comprehensionScoreRepository } from "../repositories/comprehensionScoreRepository.js";

const requireApiKey = () => {
  if (!env.GOOGLE_API_KEY) {
    throw AppError.internal("AI not configured");
  }
  return env.GOOGLE_API_KEY;
};

const getModel = () => {
  const genAI = new GoogleGenerativeAI(requireApiKey());
  return genAI.getGenerativeModel({ model: env.GEMINI_MODEL ?? "gemini-1.5-flash" });
};

const getEmbeddingModel = () => {
  const genAI = new GoogleGenerativeAI(requireApiKey());
  return genAI.getGenerativeModel({ model: env.GEMINI_EMBEDDING_MODEL ?? "text-embedding-004" });
};

const embedText = async (text: string) => {
  if (!env.GOOGLE_API_KEY) return null;
  const model = getEmbeddingModel();
  const result = await model.embedContent(text);
  return result.embedding.values ?? null;
};

const safeJsonParse = (text: string) => {
  const raw = extractJson(text);
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const normalizeDifficulty = (value: unknown): "easy" | "medium" | "hard" => {
  if (typeof value !== "string") return "medium";
  const normalized = value.toLowerCase();
  if (normalized === "easy" || normalized === "medium" || normalized === "hard") {
    return normalized;
  }
  return "medium";
};

const getToneInstruction = () => {
  const langCode = env.APP_LANG ?? "id";

  const langMap: Record<string, string> = {
    id: "Bahasa Indonesia (gaya santai anak kuliahan Jakarta)",
    en: "English (casual college-student tone)"
  };

  const targetLang = langMap[langCode] || langCode;

  return `
You are a supportive study buddy for college students.

ALWAYS reply in ${targetLang}.

Your personality:
- Talk like a same-age college friend who is smart but humble.
- Casual, friendly, and easy to understand.
- Never sound robotic, corporate, or overly formal.
- Use natural everyday language, like chatting during a study session.

Your role:
- Help explain concepts clearly and simply.
- Break down difficult topics step-by-step.
- Use relatable examples from student life when possible.
- Be encouraging and supportive, not judgmental.
- If the user is confused, guide them patiently like a good study partner.

Style rules:
- Keep explanations clear but not stiff.
- It’s okay to be a bit playful or use light humor when appropriate.
- Avoid emojis in serious/academic explanations unless the user starts using them.
- Don’t overuse slang to the point it becomes hard to understand.

You are not a lecturer. You are a helpful, reliable college friend who is good at explaining things.
`;
};

export const aiService = {
  async createMaterial(input: {
    userId: string;
    title: string;
    sourceType: string;
    originalFilename?: string | null;
    rawText?: string | null;
  }) {
    const material = await materialRepository.create(input);

    if (input.rawText) {
      const chunks = chunkText(input.rawText);
      const enriched = await Promise.all(
        chunks.map(async (content) => ({
          materialId: material.id,
          content,
          embedding: await embedText(content)
        }))
      );
      await contentChunkRepository.bulkCreate(enriched);
    }

    return material;
  },

  async createMaterialFromFile(input: {
    userId: string;
    title: string;
    originalFilename?: string | null;
    buffer: Buffer;
    mimetype: string;
  }) {
    const rawText = await extractTextFromFile(input.buffer, input.mimetype);
    if (!rawText) {
      throw AppError.badRequest("Unsupported file type");
    }

    return this.createMaterial({
      userId: input.userId,
      title: input.title,
      sourceType: "file",
      originalFilename: input.originalFilename,
      rawText
    });
  },

  async generateSummary(materialId: string) {
    const material = await materialRepository.findById(materialId);
    if (!material || !material.rawText) {
      throw AppError.notFound("Material not found");
    }

    const existingSummary = await summaryRepository.findLatestByMaterialId(materialId);
    if (existingSummary) {
      return existingSummary;
    }

    const model = getModel();
    const prompt = `${getToneInstruction()}\n\nRingkas materi berikut menjadi poin-poin singkat dan jelas.\n\n${material.rawText}`;
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return summaryRepository.create({ materialId, content: summary });
  },

  async generateFlashcards(materialId: string, count = 10) {
    const material = await materialRepository.findById(materialId);
    if (!material || !material.rawText) {
      throw AppError.notFound("Material not found");
    }

    const existing = await flashcardRepository.findByMaterialId(materialId);
    if (existing.length > 0) {
      return existing;
    }

    const model = getModel();
    const prompt = `${getToneInstruction()}
    Buat ${count} pertanyaan benar/salah (true/false) dari materi berikut.
    Kembalikan dalam format JSON array dengan struktur:
    {
    "front": "pernyataan atau pertanyaan",
    "back": "penjelasan singkat kenapa jawabannya benar atau salah",
    "correctAnswer": true | false,
    "difficulty": "easy" | "medium" | "hard"
    }
    
    Aturan tingkat kesulitan:
    - easy  → fakta langsung, definisi dasar, atau konsep yang disebutkan jelas di materi
    - medium → butuh sedikit pemahaman atau hubungan antar konsep
    - hard → butuh penalaran, implikasi, atau pemahaman mendalam dari materi

    Usahakan distribusi tingkat kesulitan seimbang:
    - 30% easy
    - 40% medium
    - 30% hard
    
    Pastikan:
    - Jawaban benar-benar bisa ditentukan dari materi
    - Penjelasan singkat, jelas, dan membantu belajar
    - Gunakan bahasa sesuai instruksi sebelumnya
    - Jangan tambahkan teks di luar JSON
    
    Materi: ${material.rawText}`;

    const result = await model.generateContent(prompt);
    const parsed = safeJsonParse(result.response.text());

    if (!Array.isArray(parsed)) {
      throw AppError.internal("Failed to parse flashcards");
    }

    const items = parsed
      .filter((item) => item?.front && item?.back && typeof item?.correctAnswer === "boolean")
      .map((item) => ({
        materialId,
        front: String(item.front),
        back: String(item.back),
        correctAnswer: Boolean(item.correctAnswer),
        difficulty: normalizeDifficulty(item?.difficulty)
      }));

    return flashcardRepository.bulkCreate(items);
  },

  async generateQuiz(materialId: string, count = 5) {
    const material = await materialRepository.findById(materialId);
    if (!material || !material.rawText) {
      throw AppError.notFound("Material not found");
    }

    const existing = await quizRepository.findByMaterialId(materialId);
    if (existing.length > 0) {
      return existing;
    }

    const model = getModel();
    const prompt = `${getToneInstruction()}
    Buat ${count} soal pilihan ganda dari materi berikut.
    Format JSON array:
    {
    "question": "pertanyaan",
    "options": ["A", "B", "C", "D"],
    "answer": "A",
    "explanation": "penjelasan kenapa jawabannya benar",
    "difficulty": "easy" | "medium" | "hard"
    }
    
    Aturan tingkat kesulitan:
    - easy  → menguji ingatan langsung atau definisi dasar
    - medium → menguji pemahaman konsep atau perbandingan
    - hard → menguji analisis, penerapan konsep, atau hubungan kompleks

    Usahakan distribusi tingkat kesulitan seimbang:
    - 30% easy
    - 40% medium
    - 30% hard

    
    Aturan tambahan:
    - Hanya satu jawaban yang benar
    - Distractor (opsi salah) harus masuk akal
    - Explanation singkat tapi jelas
    - Jangan tambahkan teks di luar JSON
    - Gunakan bahasa sesuai instruksi sebelumnya
    
    Materi: ${material.rawText}`;

    const result = await model.generateContent(prompt);
    const parsed = safeJsonParse(result.response.text());

    if (!Array.isArray(parsed)) {
      throw AppError.internal("Failed to parse quiz");
    }

    const items = parsed
      .filter((item) => item?.question && Array.isArray(item?.options) && item?.answer)
      .map((item) => ({
        materialId,
        question: String(item.question),
        options: item.options.map((opt: unknown) => String(opt)),
        answer: String(item.answer),
        explanation: item.explanation ? String(item.explanation) : null,
        difficulty: normalizeDifficulty(item?.difficulty)
      }));

    return quizRepository.bulkCreate(items);
  },

  async recordFlashcardAttempt(input: {
    userId: string;
    materialId: string;
    flashcardId: string;
    selectedAnswer: boolean;
  }) {
    const flashcard = await flashcardRepository.findById(input.flashcardId);
    if (!flashcard) {
      throw AppError.notFound("Flashcard not found");
    }

    const isCorrect = flashcard.correctAnswer === input.selectedAnswer;

    await flashcardAttemptRepository.create({
      userId: input.userId,
      flashcardId: input.flashcardId,
      isCorrect
    });

    return this.updateComprehensionScore(input.userId, input.materialId);
  },

  async recordQuizAttempt(input: {
    userId: string;
    materialId: string;
    quizId: string;
    selectedAnswer: string;
  }) {
    const quiz = await quizRepository.findById(input.quizId);
    if (!quiz) {
      throw AppError.notFound("Quiz not found");
    }

    const isCorrect = quiz.answer === input.selectedAnswer;

    await quizAttemptRepository.create({
      userId: input.userId,
      quizId: input.quizId,
      selectedAnswer: input.selectedAnswer,
      isCorrect
    });

    return this.updateComprehensionScore(input.userId, input.materialId);
  },

  async updateComprehensionScore(userId: string, materialId: string) {
    const [flashTotal, flashCorrect, quizTotal, quizCorrect] = await Promise.all([
      flashcardAttemptRepository.countByUserMaterial(userId, materialId),
      flashcardAttemptRepository.countCorrectByUserMaterial(userId, materialId),
      quizAttemptRepository.countByUserMaterial(userId, materialId),
      quizAttemptRepository.countCorrectByUserMaterial(userId, materialId)
    ]);

    const total = flashTotal + quizTotal;
    const correct = flashCorrect + quizCorrect;
    const score = total === 0 ? 0 : Math.round((correct / total) * 100);

    return comprehensionScoreRepository.upsert({ userId, materialId, score });
  },

  async getMaterialProgress(userId: string, materialId: string) {
    const [flashTotal, flashAttempted, quizTotal, quizAttempted] = await Promise.all([
      flashcardRepository.countByMaterialId(materialId),
      flashcardRepository.countAttemptedDistinctByUserMaterial(userId, materialId),
      quizRepository.countByMaterialId(materialId),
      quizRepository.countAttemptedDistinctByUserMaterial(userId, materialId)
    ]);

    const flashProgress = flashTotal === 0 ? 0 : Math.round((flashAttempted / flashTotal) * 100);
    const quizProgress = quizTotal === 0 ? 0 : Math.round((quizAttempted / quizTotal) * 100);

    const totalItems = flashTotal + quizTotal;
    const totalAttempted = flashAttempted + quizAttempted;
    const totalProgress = totalItems === 0 ? 0 : Math.round((totalAttempted / totalItems) * 100);

    return {
      flashcard: { total: flashTotal, attempted: flashAttempted, progress: flashProgress },
      quiz: { total: quizTotal, attempted: quizAttempted, progress: quizProgress },
      total: { total: totalItems, attempted: totalAttempted, progress: totalProgress }
    };
  },

  async listMaterialsWithProgress(userId: string) {
    const materials = await materialRepository.findByUserId(userId);
    type Progress = Awaited<ReturnType<typeof aiService.getMaterialProgress>>;
    const result = [] as Array<{ material: (typeof materials)[number]; progress: Progress }>;

    for (const material of materials) {
      const progress = await aiService.getMaterialProgress(userId, material.id);
      result.push({ material, progress });
    }

    return result;
  }
};
