import { ConfirmUserToken } from "../entities/ConfirmUserToken";

export interface IConfirmUserTokenRepository {
  create(data: { tokenId: string; userId: string }): Promise<void>;
  findByTokenId(tokenId: string): Promise<ConfirmUserToken>;
  delete(tokenId: string): Promise<void>;
}
