export interface RefreshToken {
  tokenId: string;
  userId: string;
  revoked: boolean;
  expiresAt: Date;
  createdAt: Date;
}
