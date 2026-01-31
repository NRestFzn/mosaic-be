import { healthRepository } from "../repositories/healthRepository.js";

export const healthService = {
  getHealth() {
    const uptime = healthRepository.getUptimeSeconds();
    return {
      status: "ok",
      uptime,
      timestamp: new Date().toISOString()
    };
  }
};
