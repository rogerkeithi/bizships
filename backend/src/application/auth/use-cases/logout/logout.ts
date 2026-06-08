import { inject, injectable } from "inversify";
import { JwtService } from "@src/services/jwt/jwt.service";
import { TYPES } from "@src/di/types";
import { IRefreshTokenRepository } from "@src/domain/token/repositories/refresh-token-repository.interface";
import { LogoutReq } from "./logout.req.dto";

@injectable()
export class LogoutUseCase {
  constructor(
    @inject(TYPES.IRefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,

    @inject(JwtService)
    private jwtService: JwtService,
  ) {}
  async execute(data: LogoutReq): Promise<void> {
    const payload = this.jwtService.verifyRefreshToken(data.refreshToken);

    await this.refreshTokenRepository.revoke(payload.jti!);
  }
}
