import { z } from "zod";

export const registerSchema = z.object({
  fullname: z.string().min(2).max(150),
  email: z.string().email().max(150),
  password: z.string().min(8).max(255)
});

export const loginSchema = z.object({
  email: z.string().email().max(150),
  password: z.string().min(8).max(255)
});
