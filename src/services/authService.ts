import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

import { env } from "../config/env.js";
import { userRepository } from "../repositories/userRepository.js";
import { AppError } from "../utils/appError.js";
import type {
  AuthResponseDto,
  LoginRequestDto,
  RegisterRequestDto,
  UserSafeDto
} from "../types/dto/auth.js";

const toSafeUser = (user: { id: string; fullname: string; email: string }): UserSafeDto => ({
  id: user.id,
  fullname: user.fullname,
  email: user.email
});

export const authService = {
  async register(input: RegisterRequestDto): Promise<AuthResponseDto> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw AppError.conflict("Email already registered", "EMAIL_EXISTS");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await userRepository.create({
      fullname: input.fullname,
      email: input.email,
      password: passwordHash
    });

    const secret: Secret = env.JWT_SECRET;
    const token = jwt.sign({ sub: user.id, email: user.email }, secret, {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
    });

    return { user: toSafeUser(user), token };
  },

  async login(input: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw AppError.unauthorized("Invalid credentials", "INVALID_CREDENTIALS");
    }

    const ok = await bcrypt.compare(input.password, user.password);
    if (!ok) {
      throw AppError.unauthorized("Invalid credentials", "INVALID_CREDENTIALS");
    }

    const secret: Secret = env.JWT_SECRET;
    const token = jwt.sign({ sub: user.id, email: user.email }, secret, {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
    });

    return { user: toSafeUser(user), token };
  }
};
