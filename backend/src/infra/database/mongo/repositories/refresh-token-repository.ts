import { injectable } from "inversify";
import { RefreshTokenModel } from "../models/refresh-token-model";
import { IRefreshTokenRepository } from "@src/domain/token/repositories/refresh-token-repository.interface";
import { RefreshToken } from "@src/domain/token/entities/RefreshToken";
import { RefreshTokenNotFoundError } from "@src/shared/errors/user-errors";
import { RefreshTokenPersistenceMapper } from "../mappers/refresh-token-persistence-mapper";

@injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(data: {
    tokenId: string;
    userId: string;
    expiresAt: Date;
  }): Promise<void> {
    await RefreshTokenModel.create({
      ...data,
      revoked: false,
    });
  }

  async findByTokenId(tokenId: string): Promise<RefreshToken> {
    const refreshToken = await RefreshTokenModel.findOne({ tokenId }).lean();

    if (!refreshToken) {
      throw new RefreshTokenNotFoundError();
    }

    return RefreshTokenPersistenceMapper.toDomain(refreshToken);
  }

  async revoke(tokenId: string): Promise<void> {
    await RefreshTokenModel.updateOne({ tokenId }, { $set: { revoked: true } });
  }
}
