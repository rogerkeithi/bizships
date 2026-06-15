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

  async sendCode(
    email: string,
    code: string,
    title: string,
    description: string,
  ): Promise<void> {
    const domain = process.env.DOMAIN;
    const projectName = process.env.PROJECT_NAME;

    await this.resend.emails.send({
      from: `${projectName} <no-reply@${domain}>`,
      to: email,
      subject: title,
      html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 24px;
          color: #333;
        "
      >
        <h2 style="margin-bottom: 16px;">${title}</h2>

        <p style="margin-bottom: 24px;">
          ${description}
        </p>

        <div
          style="
            background-color: #f4f4f5;
            border: 1px solid #e4e4e7;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            margin-bottom: 24px;
          "
        >
          <span
            style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #111827;
            "
          >
            ${code}
          </span>
        </div>

        <p style="font-size: 14px; color: #6b7280;">
          If you did not request this code, you can safely ignore this email.
        </p>
      </div>
    `,
    });
  }
}
