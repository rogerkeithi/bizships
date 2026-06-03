export interface ConfirmUserToken {
  tokenId: string;
  userId: string;
  confirmed: boolean;
  expiresAt: Date;
  createdAt: Date;
}
