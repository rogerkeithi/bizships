import { injectable } from "inversify";
import { ConfirmUserToken } from "@src/domain/token/entities/ConfirmUserToken";
import { IConfirmUserTokenRepository } from "@src/domain/token/repositories/confirm-user-token-repository.interface";
import { ConfirmUserTokenModel } from "../models/confirm-user-token-model";
import { ConfirmUserTokenPersistenceMapper } from "../mappers/confirm-user-token-persistence-mapper";
import { ConfirmUserTokenNotFoundError } from "@src/shared/errors/user-errors";

@injectable()
export class ConfirmUserTokenRepository implements IConfirmUserTokenRepository {
  async create(data: { tokenId: string; userId: string }): Promise<void> {
    const datePlus30Min = new Date(Date.now() + 30 * 60 * 1000);

    await ConfirmUserTokenModel.create({
      ...data,
      expiresAt: datePlus30Min,
      confirmed: false,
    });
  }

  async findByTokenId(tokenId: string): Promise<ConfirmUserToken> {
    const confirmUserToken = await ConfirmUserTokenModel.findOne({
      tokenId,
    }).lean();

    if (!confirmUserToken) {
      throw new ConfirmUserTokenNotFoundError();
    }

    return ConfirmUserTokenPersistenceMapper.toDomain(confirmUserToken);
  }

  async findByUserId(userId: string): Promise<ConfirmUserToken | undefined> {
    const confirmUserToken = await ConfirmUserTokenModel.findOne({
      userId,
    }).lean();

    return confirmUserToken
      ? ConfirmUserTokenPersistenceMapper.toDomain(confirmUserToken)
      : undefined;
  }

  async confirm(tokenId: string): Promise<void> {
    await ConfirmUserTokenModel.updateOne(
      { tokenId },
      { $set: { confirmed: true } },
    );
  }

  async updateExpiresAt(tokenId: string, expiresAt: Date): Promise<void> {
    await ConfirmUserTokenModel.updateOne(
      { tokenId },
      {
        $set: {
          expiresAt,
        },
      },
    );
  }

  async delete(tokenId: string): Promise<void> {
    await ConfirmUserTokenModel.deleteOne({ tokenId });
  }
}
