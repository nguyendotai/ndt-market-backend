import { createServer } from "node:http";

import { createApp } from "@/app";
import { connectMongoDB, disconnectMongoDB } from "@/configs/database";
import { env } from "@/configs/env";
import { logger } from "@/configs/logger";

const app = createApp();
const server = createServer(app);

const startServer = async (): Promise<void> => {
  try {
    await connectMongoDB();

    server.listen(env.PORT, () => {
      logger.info(`Server is running on port ${env.PORT}`);
      logger.info(`Health check: ${env.API_PREFIX}/health`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

const shutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received. Shutting down server...`);

  server.close(async () => {
    await disconnectMongoDB();
    logger.info("Server shutdown completed");
    process.exit(0);
  });
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

void startServer();
