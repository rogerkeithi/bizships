import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod/v4";
import { AppError } from "../errors/app-error";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      errors: error.issues,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      code: error.code,
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    code: "INTERNAL_SERVER_ERROR",
  });
}
