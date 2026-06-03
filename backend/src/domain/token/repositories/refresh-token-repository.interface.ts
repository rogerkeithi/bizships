import { RefreshToken } from "../entities/RefreshToken";

export interface IRefreshTokenRepository {
  create(data: {
    tokenId: string;
    userId: string;
    expiresAt: Date;
  }): Promise<void>;
  findByTokenId(tokenId: string): Promise<RefreshToken>;
  revoke(tokenId: string): Promise<void>;
}
