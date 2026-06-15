import { Code } from "@src/domain/code/entities/Code";
import { CodeType } from "@src/shared/enums/code-type";

export class CodePersistenceMapper {
  static toDomain(raw: CodePersistenceDto): Code {
    return {
      codeId: raw.codeId,
      userId: raw.userId,
      codeType: raw.codeType,
      codeHash: raw.codeHash,
      redeemTries: raw.redeemTries,
      valid: raw.valid,
      expiresAt: raw.expiresAt,
      createdAt: raw.createdAt,
    };
  }
}

interface CodePersistenceDto {
  codeId: string;
  userId: string;
  codeType: CodeType;
  codeHash: string;
  redeemTries: number;
  valid: boolean;
  expiresAt: Date;
  createdAt: Date;
}
