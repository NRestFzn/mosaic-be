import { z } from "zod";

export const freeSlotsQuerySchema = z.object({
  start: z.string().datetime({ offset: true }),
  end: z.string().datetime({ offset: true }),
  minMinutes: z.coerce.number().int().min(1).max(240).optional()
});
