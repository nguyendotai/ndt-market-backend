import { HTTP_STATUS } from "@/constants";

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}
