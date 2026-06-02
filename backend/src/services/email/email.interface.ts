export interface IEmailService {
  sendConfirmationEmail(email: string, token: string): Promise<void>;
}
