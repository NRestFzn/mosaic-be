const startedAt = Date.now();

export const healthRepository = {
  getUptimeSeconds() {
    return Math.floor((Date.now() - startedAt) / 1000);
  }
};
