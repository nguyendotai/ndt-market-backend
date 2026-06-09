import path from "node:path";

import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "@/configs/env";
import { logger } from "@/configs/logger";
import { errorHandler } from "@/middlewares/error.middleware";
import { notFoundHandler } from "@/middlewares/notFound.middleware";
import { routes } from "@/routes";

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
  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
  app.use(
    morgan("combined", {
      stream: {
        write: (message: string) => logger.info(message.trim())
      }
    })
  );

  app.use(env.API_PREFIX, routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
