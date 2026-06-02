import { Container } from "inversify";
import { Resend } from "resend";
import { TYPES } from "../types";
import { IEmailService } from "@src/services/email/email.interface";
import { ResendEmailService } from "@src/services/email/email.service";

export function registerEmailModule(container: Container) {
  container
    .bind(TYPES.ResendClient)
    .toConstantValue(new Resend(process.env.RESEND_API_KEY!));

  container.bind<IEmailService>(TYPES.IEmailService).to(ResendEmailService);
}
