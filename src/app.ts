import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "@/configs/env.config";
import { errorHandler } from "@/middlewares/error.middleware";
import { notFoundHandler } from "@/middlewares/not-found.middleware";
import { apiRoutes } from "@/modules/routes";
import { logger } from "@/utils/logger";

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    morgan("combined", {
      stream: {
        write: (message: string) => logger.info(message.trim())
      }
    })
  );

  app.use(env.API_PREFIX, apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
