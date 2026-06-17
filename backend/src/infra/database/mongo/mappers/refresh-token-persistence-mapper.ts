import { RefreshToken } from "@src/domain/token/entities/RefreshToken";

export class RefreshTokenPersistenceMapper {
  static toDomain(raw: RefreshTokenPersistenceDto): RefreshToken {
    return {
      tokenId: raw.tokenId,
      userId: raw.userId,
      revoked: raw.revoked,
      expiresAt: raw.expiresAt,
      createdAt: raw.createdAt,
    };
  }
}

interface RefreshTokenPersistenceDto {
  tokenId: string;
  userId: string;
  revoked: boolean;
  expiresAt: Date;
  createdAt: Date;
}
