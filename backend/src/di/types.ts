import { Resend } from "resend";

export const TYPES = {
  IUserRepository: Symbol.for("IUserRepository"),
  IAuditRepository: Symbol.for("IAuditRepository"),
  IRefreshTokenRepository: Symbol.for("IRefreshTokenRepository"),
  IConfirmUserTokenRepository: Symbol.for("IConfirmUserTokenRepository"),

  IPasswordHasher: Symbol.for("IPasswordHasher"),

  IEmailService: Symbol.for("IEmailService"),

  ResendClient: Symbol.for("ResendClient"),
};

export type ResendClientType = Resend;
