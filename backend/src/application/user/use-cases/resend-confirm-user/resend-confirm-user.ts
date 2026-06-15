//so vai aceitar esse endpoint caso usuário confirmado, com token valido e sem senha
import { inject, injectable } from "inversify";
import { TYPES } from "@src/di/types";
import { IUserRepository } from "@src/domain/user/repositories/use-repository.interface";
import {
  UserAlreadyConfirmedError,
  UserNotFoundError,
} from "@src/shared/errors/user-errors";
import { IAuditRepository } from "@src/domain/audit/repositories/audit-repository.interface";
import { JwtService } from "@src/services/jwt/jwt.service";
import { randomUUID } from "crypto";
import { ResendConfirmUserReq } from "./resend-confirm-user.req.dto";
import { IConfirmUserTokenRepository } from "@src/domain/token/repositories/confirm-user-token-repository.interface";
import { IEmailService } from "@src/services/email/email.interface";
import { AuditAction } from "@src/shared/enums/audit-action";
import { Entity } from "@src/shared/enums/entity";

@injectable()
export class ResendConfirmUserUseCase {
  constructor(
    @inject(TYPES.IConfirmUserTokenRepository)
    private readonly confirmUserTokenRepository: IConfirmUserTokenRepository,
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.IAuditRepository)
    private readonly auditRepository: IAuditRepository,
    @inject(TYPES.IEmailService)
    private emailService: IEmailService,
  ) {}
  async execute(data: ResendConfirmUserReq): Promise<void> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (user.isConfirmed) {
      throw new UserAlreadyConfirmedError();
    }

    const token = await this.confirmUserTokenRepository.findByUserId(
      user.userId,
    );

    if (!token) {
      const tokenId = randomUUID();
      await this.confirmUserTokenRepository.create({
        tokenId,
        userId: user.userId,
      });

      await this.emailService.sendConfirmationEmail(
        user.email.getValue(),
        tokenId,
      );
    } else {
      const datePlus30Min = new Date(Date.now() + 30 * 60 * 1000);

      await this.confirmUserTokenRepository.updateExpiresAt(
        token.tokenId,
        datePlus30Min,
      );

      await this.emailService.sendConfirmationEmail(
        user.email.getValue(),
        token.tokenId,
      );
    }

    await this.auditRepository.create({
      action: AuditAction.USER_CONFIRM_EMAIL_RESEND,
      entity: Entity.USER,
      entityId: user.userId,
      userId: user.userId,
    });
  }
}
