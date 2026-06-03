export interface IEmailService {
  sendConfirmationEmail(email: string, tokenId: string): Promise<void>;
}
