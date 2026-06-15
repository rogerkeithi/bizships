//so vai aceitar esse endpoint caso usuário confirmado, com token valido e sem senha
import { inject, injectable } from "inversify";
import crypto from "crypto";
import { randomUUID } from "crypto";
import { TYPES } from "@src/di/types";
import { IUserRepository } from "@src/domain/user/repositories/use-repository.interface";
import { IAuditRepository } from "@src/domain/audit/repositories/audit-repository.interface";
import { SendSetupPasswordCodeReq } from "./send-setup-password-code.req.dto";
import { IEmailService } from "@src/services/email/email.interface";
import {
  UserAlreadySetPassword,
  UserNotFoundError,
} from "@src/shared/errors/user-errors";
import { ICodeRepository } from "@src/domain/code/repositories/code-repository.interface";
import { CodeType } from "@src/shared/enums/code-type";

@injectable()
export class SendSetupPasswordCodeUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.IAuditRepository)
    private readonly auditRepository: IAuditRepository,
    @inject(TYPES.ICodeRepository)
    private readonly codeRepository: ICodeRepository,
    @inject(TYPES.IEmailService)
    private emailService: IEmailService,
  ) {}
  async execute(data: SendSetupPasswordCodeReq): Promise<void> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (user.passwordHash) {
      throw new UserAlreadySetPassword();
    }

    const datePlus30Min = new Date(Date.now() + 30 * 60 * 1000);

    const code = crypto.randomInt(0, 1000000).toString().padStart(6, "0");

    const codeHash = crypto.createHash("sha256").update(code).digest("hex");

    const codeId = randomUUID();
    const codeRegister = {
      codeId,
      codeHash,
      codeType: CodeType.SETUP_PASSWORD_CODE,
      userId: user.userId,
      expiresAt: datePlus30Min,
    };

    await this.codeRepository.create(codeRegister);

    await this.emailService.sendCode(
      data.email,
      code,
      "Password Reset",
      "Use the code below to reset your password.",
    );
  }
}
