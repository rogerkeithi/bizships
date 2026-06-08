import { ErrorCode } from "../enums/error-code";
import { AppError } from "./app-error";

export class IncorrectCredentialsError extends AppError {
  constructor() {
    super(ErrorCode.INCORRECT_CREDENTIALS_ERROR, 400);
  }
}
export class RefreshTokenNotFoundError extends AppError {
  constructor() {
    super(ErrorCode.REFRESH_TOKEN_NOT_FOUND, 404);
  }
}
export class ConfirmUserTokenNotFoundError extends AppError {
  constructor() {
    super(ErrorCode.CONFIRM_USER_TOKEN_NOT_FOUND, 404);
  }
}
export class InvalidTokenError extends AppError {
  constructor() {
    super(ErrorCode.INVALID_TOKEN, 400);
  }
}
export class ExpiredTokenError extends AppError {
  constructor() {
    super(ErrorCode.EXPIRED_TOKEN, 400);
  }
}
export class UserNotFoundError extends AppError {
  constructor() {
    super(ErrorCode.USER_NOT_FOUND, 404);
  }
}
export class UserDeactivatedError extends AppError {
  constructor() {
    super(ErrorCode.USER_DEACTIVATED, 400);
  }
}
export class UserNotConfirmedError extends AppError {
  constructor() {
    super(ErrorCode.USER_NOT_CONFIRMED, 400);
  }
}
export class UserAlreadyConfirmedError extends AppError {
  constructor() {
    super(ErrorCode.USER_ALREADY_CONFIRMED, 400);
  }
}
export class UserMissingPasswordError extends AppError {
  constructor() {
    super(ErrorCode.USER_MISSING_PASSWORD, 400);
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
