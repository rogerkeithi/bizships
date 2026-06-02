import { Resend } from "resend";

export const TYPES = {
  IUserRepository: Symbol.for("IUserRepository"),
  IPasswordHasher: Symbol.for("IPasswordHasher"),
  IEmailService: Symbol.for("IEmailService"),
  ResendClient: Symbol.for("ResendClient"),
};

export type ResendClientType = Resend;
