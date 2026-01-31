import { User } from "../database/models/User.js";
import type { UserCreateDto } from "../types/dto/user.js";

export const userRepository = {
  findByEmail(email: string) {
    return User.findOne({ where: { email } });
  },
  create(data: UserCreateDto) {
    return User.create(data);
  }
};
