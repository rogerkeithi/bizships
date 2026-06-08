//so vai aceitar esse endpoint caso usuário confirmado, com token valido e sem senha
import { inject, injectable } from "inversify";
import { TYPES } from "@src/di/types";
import { IUserRepository } from "@src/domain/user/repositories/use-repository.interface";
import { UserNotFoundError } from "@src/shared/errors/user-errors";
import { IAuditRepository } from "@src/domain/audit/repositories/audit-repository.interface";
import { AuditAction } from "@src/shared/enums/audit-action";
import { Entity } from "@src/shared/enums/entity";
import { SetupPasswordReq } from "./setup-password.req.dto";
import { JwtService } from "@src/services/jwt/jwt.service";
import { IPasswordHasher } from "@src/services/password-hasher/password-hasher.interface";

@injectable()
export class SetupPasswordUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.IAuditRepository)
    private readonly auditRepository: IAuditRepository,
    @inject(TYPES.IPasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
    @inject(JwtService)
    private jwtService: JwtService,
  ) {}
  async execute(data: SetupPasswordReq): Promise<void> {
    const payload = this.jwtService.verifyAccessToken(data.setupPasswordToken);

    const userId = payload.sub;
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const passwordHash = await this.passwordHasher.hash(data.password);

    user.setPassword(passwordHash);

    await this.userRepository.update(user);

    await this.auditRepository.create({
      action: AuditAction.USER_PASSWORD_SET,
      entity: Entity.USER,
      entityId: userId,
      userId: userId,
    });
  }
}
