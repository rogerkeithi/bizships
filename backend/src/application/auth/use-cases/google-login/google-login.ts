import { randomUUID } from "crypto";
import { OAuth2Client } from "google-auth-library";
import { inject, injectable } from "inversify";

import { LoginRes } from "../login/login.res.dto";
import { GoogleLoginReq } from "./google-login.req.dto";
import { TYPES } from "@src/di/types";
import { User } from "@src/domain/user/entities/User";
import { IUserRepository } from "@src/domain/user/repositories/use-repository.interface";
import { Country } from "@src/domain/user/value-objects/Country";
import { Email } from "@src/domain/user/value-objects/Email";
import { IRefreshTokenRepository } from "@src/domain/token/repositories/refresh-token-repository.interface";
import { JwtService } from "@src/services/jwt/jwt.service";
import {
  InvalidTokenError,
  UserDeactivatedError,
} from "@src/shared/errors/user-errors";

@injectable()
export class GoogleLoginUseCase {
  private readonly googleClient = new OAuth2Client();

  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,

    @inject(TYPES.IRefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,

    @inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async execute(data: GoogleLoginReq): Promise<
    LoginRes & { setupPasswordToken?: string }
  > {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      throw new InvalidTokenError();
    }

    let ticket;

    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken: data.credential,
        audience: googleClientId,
      });
    } catch {
      throw new InvalidTokenError();
    }
    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
      throw new InvalidTokenError();
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase();
    const name = payload.name;
    const avatarUrl = payload.picture;

    let user =
      (await this.userRepository.findByGoogleId(googleId)) ??
      (await this.userRepository.findByEmail(email));

    if (!user) {
      user = User.create({
        userId: randomUUID(),
        email: new Email(email),
        country: new Country("BR"),
      });
    }

    if (!user.status) {
      throw new UserDeactivatedError();
    }

    if (user.googleId !== googleId || user.avatarUrl !== avatarUrl) {
      user.linkGoogleAccount({
        googleId,
        name,
        avatarUrl,
        authProvider: "google",
      });

      if (await this.userRepository.findById(user.userId)) {
        await this.userRepository.update(user);
      } else {
        await this.userRepository.create(user);
      }
    }

    const tokens = await this.issueTokens(user.userId);

    if (user.passwordHash) {
      return tokens;
    }

    return {
      ...tokens,
      setupPasswordToken: this.jwtService.generateSetupPasswordToken(
        user.userId,
      ),
    };
  }

  private async issueTokens(userId: string): Promise<LoginRes> {
    const accessToken = this.jwtService.generateAccessToken(userId);
    const { token: refreshToken, tokenId } =
      this.jwtService.generateRefreshToken(userId);

    await this.refreshTokenRepository.create({
      tokenId,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
