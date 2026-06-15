import { ConfirmUserToken } from "../entities/ConfirmUserToken";

export interface IConfirmUserTokenRepository {
  create(data: { tokenId: string; userId: string }): Promise<void>;
  findByTokenId(tokenId: string): Promise<ConfirmUserToken>;
  findByUserId(userId: string): Promise<ConfirmUserToken | undefined>;
  confirm(tokenId: string): Promise<void>;
  updateExpiresAt(tokenId: string, expiresAt: Date): Promise<void>;
  delete(tokenId: string): Promise<void>;
}
