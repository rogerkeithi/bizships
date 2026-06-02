export abstract class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly statusCode: number,
  ) {
    super(code);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}
