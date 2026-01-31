import "dotenv/config";

const getEnv = (key: string, fallback?: string) => {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
};

const getOptionalEnv = (key: string, fallback?: string) => {
  return process.env[key] ?? fallback ?? null;
};

export const env = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: Number(getEnv("PORT", "3000")),
  DB_HOST: getEnv("DB_HOST", "localhost"),
  DB_PORT: Number(getEnv("DB_PORT", "3306")),
  DB_NAME: getEnv("DB_NAME"),
  DB_USER: getEnv("DB_USER"),
  DB_PASSWORD: getEnv("DB_PASSWORD"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "7d"),
  GOOGLE_API_KEY: getOptionalEnv("GOOGLE_API_KEY"),
  GEMINI_MODEL: getOptionalEnv("GEMINI_MODEL", "gemini-1.5-flash-001"),
  GEMINI_EMBEDDING_MODEL: getOptionalEnv("GEMINI_EMBEDDING_MODEL", "text-embedding-004"),
  APP_LANG: getOptionalEnv("APP_LANG", "id"),
  GOOGLE_OAUTH_CLIENT_ID: getOptionalEnv("GOOGLE_OAUTH_CLIENT_ID"),
  GOOGLE_OAUTH_CLIENT_SECRET: getOptionalEnv("GOOGLE_OAUTH_CLIENT_SECRET"),
  GOOGLE_OAUTH_REDIRECT_URI: getOptionalEnv("GOOGLE_OAUTH_REDIRECT_URI")
};
