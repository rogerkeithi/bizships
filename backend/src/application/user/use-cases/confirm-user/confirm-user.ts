import { inject, injectable } from "inversify";
import { TYPES } from "@src/di/types";
import {
  ConfirmUserTokenNotFoundError,
  ExpiredTokenError,
  UserAlreadyConfirmedError,
  UserMissingPasswordError,
  UserNotFoundError,
} from "@src/shared/errors/user-errors";
import { IAuditRepository } from "@src/domain/audit/repositories/audit-repository.interface";
import { AuditAction } from "@src/shared/enums/audit-action";
import { Entity } from "@src/shared/enums/entity";
import { IConfirmUserTokenRepository } from "@src/domain/token/repositories/confirm-user-token-repository.interface";
import { ConfirmUserReq } from "./confirm-user.req.dto";
import { ConfirmUserRes } from "./confirm-user.res.dto";
import { JwtService } from "@src/services/jwt/jwt.service";
import { IUserRepository } from "@src/domain/user/repositories/use-repository.interface";

@injectable()
export class ConfirmUserUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.IAuditRepository)
    private readonly auditRepository: IAuditRepository,
    @inject(TYPES.IConfirmUserTokenRepository)
    private readonly confirmUserTokenRepository: IConfirmUserTokenRepository,
    @inject(JwtService)
    private jwtService: JwtService,
  ) {}
  async execute(data: ConfirmUserReq): Promise<ConfirmUserRes> {
    const token = await this.confirmUserTokenRepository.findByTokenId(
      data.tokenId,
    );

    if (!token) {
      throw new ConfirmUserTokenNotFoundError();
    }

    if (token.expiresAt.getTime() < Date.now()) {
      throw new ExpiredTokenError();
    }

    const user = await this.userRepository.findById(token.userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    if (token.confirmed) {
      if (!user.passwordHash) {
        throw new UserMissingPasswordError();
      } else {
        throw new UserAlreadyConfirmedError();
      }
    }

    user.setConfirmed();

    await this.confirmUserTokenRepository.confirm(data.tokenId);

    await this.userRepository.update(user);

    const setupPasswordToken = this.jwtService.generateSetupPasswordToken(
      token.userId,
    );

    await this.auditRepository.create({
      action: AuditAction.USER_CONFIRMED_EMAIL,
      entity: Entity.USER,
      entityId: token.userId,
      userId: token.userId,
    });

    return { setupPasswordToken };
  }
}
