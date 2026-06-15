//so vai aceitar esse endpoint caso usuário confirmado, com token valido e sem senha
import { inject, injectable } from "inversify";
import crypto from "crypto";
import { randomUUID } from "crypto";
import { TYPES } from "@src/di/types";
import { IUserRepository } from "@src/domain/user/repositories/use-repository.interface";
import { IAuditRepository } from "@src/domain/audit/repositories/audit-repository.interface";
import { IEmailService } from "@src/services/email/email.interface";
import {
  CodeNotFoundError,
  InvalidCodeError,
  UserAlreadySetPassword,
  UserNotFoundError,
} from "@src/shared/errors/user-errors";
import { ICodeRepository } from "@src/domain/code/repositories/code-repository.interface";
import { CodeType } from "@src/shared/enums/code-type";
import { VerifySetupPasswordCodeReq } from "./verify-setup-password-code.req.dto";
import { VerifySetupPasswordCodeRes } from "./verify-setup-password-code.res.dto";
import { JwtService } from "@src/services/jwt/jwt.service";

@injectable()
export class VerifySetupPasswordCodeUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.IAuditRepository)
    private readonly auditRepository: IAuditRepository,
    @inject(TYPES.ICodeRepository)
    private readonly codeRepository: ICodeRepository,
    @inject(TYPES.IEmailService)
    private emailService: IEmailService,
    @inject(JwtService)
    private jwtService: JwtService,
  ) {}
  async execute(
    data: VerifySetupPasswordCodeReq,
  ): Promise<VerifySetupPasswordCodeRes> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const codeSaved = await this.codeRepository.findValidUserCode(
      user.userId,
      CodeType.SETUP_PASSWORD_CODE,
    );

    if (!codeSaved) {
      throw new CodeNotFoundError();
    }

    const receivedHash = crypto
      .createHash("sha256")
      .update(data.code)
      .digest("hex");

    if (receivedHash === codeSaved.codeHash) {
      const setupPasswordToken = this.jwtService.generateSetupPasswordToken(
        user.userId,
      );

      return { setupPasswordToken: setupPasswordToken };
    }

    throw new InvalidCodeError();
  }
}
