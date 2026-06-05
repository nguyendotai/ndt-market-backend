import mongoose from "mongoose";

import { env } from "@/configs/env.config";
import { logger } from "@/utils/logger";

export const connectMongoDB = async (): Promise<void> => {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.MONGODB_URI);
  logger.info("MongoDB connected");
};

export const disconnectMongoDB = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info("MongoDB disconnected");
};
