import { CodeType } from "@src/shared/enums/code-type";
import { Code } from "../entities/Code";

export interface ICodeRepository {
  create(data: { codeId: string; userId: string }): Promise<void>;
  findByCodeId(codeId: string): Promise<Code>;
  findValidUserCode(
    userId: string,
    codeType: CodeType,
  ): Promise<Code | undefined>;
}
