import { CodeType } from "@src/shared/enums/code-type";

export interface Code {
  codeId: string;
  userId: string;
  codeType: CodeType;
  codeHash: string;
  redeemTries: number;
  valid: boolean;
  expiresAt: Date;
  createdAt: Date;
}
