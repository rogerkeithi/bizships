import { ConfirmUserToken } from "@src/domain/token/entities/ConfirmUserToken";

export class ConfirmUserTokenPersistenceMapper {
  static toDomain(raw: ConfirmUserTokenPersistenceDto): ConfirmUserToken {
    return {
      tokenId: raw.userId,
      userId: raw.userId,
      confirmed: raw.confirmed,
      expiresAt: raw.expiresAt,
      createdAt: raw.createdAt,
    };
  }
}

interface ConfirmUserTokenPersistenceDto {
  tokenId: string;
  userId: string;
  confirmed: boolean;
  expiresAt: Date;
  createdAt: Date;
}
