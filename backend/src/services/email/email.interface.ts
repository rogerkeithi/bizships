export interface IEmailService {
  sendConfirmationEmail(email: string, tokenId: string): Promise<void>;
  sendCode(
    email: string,
    code: string,
    title: string,
    description: string,
  ): Promise<void>;
}
