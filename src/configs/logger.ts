import winston from "winston";

import { env } from "@/configs/env";

const isProduction = env.NODE_ENV === "production";

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    isProduction
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ level, message, stack, timestamp }) => {
            const logMessage = stack ?? message;

            return `${timestamp} ${level}: ${logMessage}`;
          })
        )
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"]
    })
  ]
});
