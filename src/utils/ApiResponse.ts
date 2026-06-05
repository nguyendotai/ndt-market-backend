type ResponseMeta = Record<string, unknown>;

export class ApiResponse<T> {
  public readonly success = true;
  public readonly message: string;
  public readonly data: T;
  public readonly meta?: ResponseMeta;

  constructor(data: T, message = "Success", meta?: ResponseMeta) {
    this.data = data;
    this.message = message;
    this.meta = meta;
  }
}
