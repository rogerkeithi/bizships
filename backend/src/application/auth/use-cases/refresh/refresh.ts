import { inject, injectable } from "inversify";
import { JwtService } from "@src/services/jwt/jwt.service";
import { TYPES } from "@src/di/types";
import { IRefreshTokenRepository } from "@src/domain/token/repositories/refresh-token-repository.interface";
import { RefreshReq } from "./refresh.req.dto";
import { RefreshRes } from "./refresh.res.dto";
import { InvalidTokenError } from "@src/shared/errors/user-errors";

@injectable()
export class RefreshUseCase {
  constructor(
    @inject(TYPES.IRefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,

    @inject(JwtService)
    private jwtService: JwtService,
  ) {}
  async execute(data: RefreshReq): Promise<RefreshRes> {
    const payload = this.jwtService.verifyRefreshToken(data.refreshToken);

    if (payload.type !== "refresh") {
      throw new InvalidTokenError();
    }

    const stored = await this.refreshTokenRepository.findByTokenId(
      payload.jti!,
    );

    if (!stored || stored.revoked) {
      throw new InvalidTokenError();
    }

    const newAccessToken = this.jwtService.generateAccessToken(payload.sub);

    return {
      accessToken: newAccessToken,
    };
  }
}
