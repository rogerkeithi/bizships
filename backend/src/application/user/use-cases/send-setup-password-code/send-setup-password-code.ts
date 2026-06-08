//so vai aceitar esse endpoint caso usuário confirmado, com token valido e sem senha
import { inject, injectable } from "inversify";
import { TYPES } from "@src/di/types";
import { IUserRepository } from "@src/domain/user/repositories/use-repository.interface";
import { UserNotFoundError } from "@src/shared/errors/user-errors";
import { IAuditRepository } from "@src/domain/audit/repositories/audit-repository.interface";
import { AuditAction } from "@src/shared/enums/audit-action";
import { Entity } from "@src/shared/enums/entity";
import { JwtService } from "@src/services/jwt/jwt.service";
import { IPasswordHasher } from "@src/services/password-hasher/password-hasher.interface";
import { SendSetupPasswordCodeReq } from "./send-setup-password-code.req.dto";

@injectable()
export class SendSetupPasswordCodeUseCase {
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
  async execute(data: SendSetupPasswordCodeReq): Promise<void> {}
}
