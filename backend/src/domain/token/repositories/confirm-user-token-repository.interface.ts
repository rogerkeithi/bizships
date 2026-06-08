import { ConfirmUserToken } from "../entities/ConfirmUserToken";

export interface IConfirmUserTokenRepository {
  create(data: { tokenId: string; userId: string }): Promise<void>;
  findByTokenId(tokenId: string): Promise<ConfirmUserToken>;
  confirm(tokenId: string): Promise<void>;
  delete(tokenId: string): Promise<void>;
}
