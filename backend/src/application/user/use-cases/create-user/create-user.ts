import { inject, injectable } from "inversify";
import { CreateUserReq } from "./create-user.req.dto";
import { randomUUID } from "crypto";
import { TYPES } from "@src/di/types";
import { IUserRepository } from "@src/domain/user/repositories/use-repository.interface";
import { Country } from "@src/domain/user/value-objects/Country";
import { Email } from "@src/domain/user/value-objects/Email";
import { User } from "@src/domain/user/entities/User";
import { UserAlreadyExistsError } from "@src/shared/errors/user-errors";
import { IEmailService } from "@src/services/email/email.interface";
import { IAuditRepository } from "@src/domain/audit/repositories/audit-repository.interface";
import { AuditAction } from "@src/shared/enums/audit-action";
import { Entity } from "@src/shared/enums/entity";
import { IConfirmUserTokenRepository } from "@src/domain/token/repositories/confirm-user-token-repository.interface";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.IAuditRepository)
    private readonly auditRepository: IAuditRepository,
    @inject(TYPES.IConfirmUserTokenRepository)
    private readonly confirmUserTokenRepository: IConfirmUserTokenRepository,
    @inject(TYPES.IEmailService)
    private emailService: IEmailService,
  ) {}
  async execute(data: CreateUserReq): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    const userId = randomUUID();
    const email = new Email(data.email);
    const country = new Country(data.country);

    const user = User.create({ userId, email, country });

    await this.userRepository.create(user);

    const tokenId = randomUUID();
    await this.confirmUserTokenRepository.create({
      tokenId,
      userId,
    });

    await this.emailService.sendConfirmationEmail(email.getValue(), tokenId);

    await this.auditRepository.create({
      action: AuditAction.CREATED_USER,
      entity: Entity.USER,
      entityId: userId,
      userId: userId,
    });
  }
}
