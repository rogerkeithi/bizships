import { injectable, inject } from "inversify";
import { IEmailService } from "./email.interface";
import { Resend } from "resend";
import { TYPES } from "@src/di/types";

@injectable()
export class ResendEmailService implements IEmailService {
  constructor(
    @inject(TYPES.ResendClient)
    private resend: Resend,
  ) {}

  async sendConfirmationEmail(email: string, tokenId: string) {
    const confirmUrl = `https://${process.env.APP_URL}/confirm-email?tokenId=${tokenId}`;
    const domain = `${process.env.DOMAIN}`;
    const projectName = `${process.env.PROJECT_NAME}`;

    await this.resend.emails.send({
      from: `${projectName} <no-reply@${domain}>`,
      to: email,
      subject: "Confirm your account",
      html: `
        <div style="font-family: Arial">
          <h2>Welcome 👋</h2>
          <p>Click below to confirm your account:</p>
          <a href="${confirmUrl}">Confirm account</a>
        </div>
      `,
    });
  }
}
