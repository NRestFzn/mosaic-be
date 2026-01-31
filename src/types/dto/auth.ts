export type RegisterRequestDto = {
  fullname: string;
  email: string;
  password: string;
};

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type AuthResponseDto = {
  user: UserSafeDto;
  token: string;
};

export type UserSafeDto = {
  id: string;
  fullname: string;
  email: string;
};
