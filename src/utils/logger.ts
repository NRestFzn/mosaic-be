export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    console.log(`[info] ${message}`, meta ?? "");
  },
  error(message: string, meta?: Record<string, unknown>) {
    console.error(`[error] ${message}`, meta ?? "");
  }
};
