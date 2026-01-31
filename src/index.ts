import { createServer } from "node:http";

import { app } from "./app.js";
import { sequelize } from "./config/database.js";
import { env } from "./config/env.js";

const server = createServer(app);

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("[db] connected");

    server.listen(env.PORT, () => {
      console.log(`[server] running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("[db] connection failed", error);
    process.exit(1);
  }
};

start();
