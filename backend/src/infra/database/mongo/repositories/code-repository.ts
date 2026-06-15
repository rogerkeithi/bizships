import { Code } from "@src/domain/code/entities/Code";
import { ICodeRepository } from "@src/domain/code/repositories/code-repository.interface";
import { injectable } from "inversify";
import { CodeModel } from "../models/code-model";
import { CodeType } from "@src/shared/enums/code-type";
import { CodePersistenceMapper } from "../mappers/code-persistence-mapper";
import { CodeNotFoundError } from "@src/shared/errors/user-errors";

@injectable()
export class CodeRepository implements ICodeRepository {
  async create(data: {
    codeId: string;
    userId: string;
    codeType: CodeType;
    codeHash: string;
    expiresAt: Date;
  }): Promise<void> {
    await CodeModel.updateMany(
      {
        userId: data.userId,
        codeType: data.codeType,
        valid: true,
      },
      {
        $set: { valid: false },
      },
    );

    await CodeModel.create({
      ...data,
    });
  }

  async findByCodeId(codeId: string): Promise<Code> {
    const code = await CodeModel.findOne({ codeId }).lean();

    if (!code) {
      throw new CodeNotFoundError();
    }

    return CodePersistenceMapper.toDomain(code);
  }

  async findValidUserCode(
    userId: string,
    codeType: CodeType,
  ): Promise<Code | undefined> {
    const codeToken = await CodeModel.findOne({
      userId,
      codeType,
      valid: true,
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .lean();

    return codeToken ? CodePersistenceMapper.toDomain(codeToken) : undefined;
  }
}
