import { HTTP_STATUS } from "@/constants";

export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}
