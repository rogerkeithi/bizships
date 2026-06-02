import { ErrorCode } from "../enums/error-code";
import { AppError } from "./app-error";

export class UserNotFoundError extends AppError {
  constructor() {
    super(ErrorCode.USER_NOT_FOUND, 404);
  }
}

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super(ErrorCode.USER_ALREADY_EXISTS, 409);
  }
}

export class InvalidCpfError extends AppError {
  constructor() {
    super(ErrorCode.INVALID_CPF, 400);
  }
}

export class InvalidPhoneError extends AppError {
  constructor() {
    super(ErrorCode.INVALID_PHONE, 400);
  }
}

export class InvalidEmailError extends AppError {
  constructor() {
    super(ErrorCode.INVALID_EMAIL, 400);
  }
}

export class InvalidPasswordHashError extends AppError {
  constructor() {
    super(ErrorCode.INVALID_PASSWORD_HASH, 400);
  }
}

export class InvalidCountryError extends AppError {
  constructor() {
    super(ErrorCode.INVALID_COUNTRY, 400);
  }
}
