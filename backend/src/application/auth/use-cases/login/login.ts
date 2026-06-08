import { inject, injectable } from "inversify";
import { JwtService } from "@src/services/jwt/jwt.service";
import { TYPES } from "@src/di/types";
import { IUserRepository } from "@src/domain/user/repositories/use-repository.interface";
import { IRefreshTokenRepository } from "@src/domain/token/repositories/refresh-token-repository.interface";
import { LoginRes } from "./login.res.dto";
import { LoginReq } from "./login.req.dto";
import { IPasswordHasher } from "@src/services/password-hasher/password-hasher.interface";
import {
  IncorrectCredentialsError,
  UserDeactivatedError,
  UserMissingPasswordError,
  UserNotConfirmedError,
  UserNotFoundError,
} from "@src/shared/errors/user-errors";

@injectable()
export class LoginUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,

    @inject(TYPES.IRefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,

    @inject(TYPES.IPasswordHasher)
    private readonly passwordHasher: IPasswordHasher,

    @inject(JwtService)
    private jwtService: JwtService,
  ) {}
  async execute(data: LoginReq): Promise<LoginRes> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (!user.isConfirmed) {
      throw new UserNotConfirmedError();
    }

    if (!user.passwordHash) {
      throw new UserMissingPasswordError();
    }

    if (!user.status) {
      throw new UserDeactivatedError();
    }

    const passed = await this.passwordHasher.compare(
      data.password,
      user.passwordHash,
    );

    if (user && passed) {
      const accessToken = this.jwtService.generateAccessToken(user.userId);

      const { token: refreshToken, tokenId } =
        this.jwtService.generateRefreshToken(user.userId);

      await this.refreshTokenRepository.create({
        tokenId,
        userId: user.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      return {
        accessToken,
        refreshToken,
      };
    } else {
      throw new IncorrectCredentialsError();
    }
  }
}
