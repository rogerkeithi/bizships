import jwt, { TokenExpiredError } from "jsonwebtoken";
import { randomUUID } from "crypto";
import { injectable } from "inversify";
import {
  ExpiredTokenError,
  InvalidTokenError,
} from "@src/shared/errors/user-errors";
export interface JwtPayload {
  sub: string;
  type: string;
  jti?: string;
}
@injectable()
export class JwtService {
  generateAccessToken(userId: string) {
    return jwt.sign({ sub: userId, type: "access" }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });
  }

  generateRefreshToken(userId: string) {
    const tokenId = randomUUID();

    const token = jwt.sign(
      {
        sub: userId,
        type: "refresh",
        jti: tokenId,
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" },
    );

    return { token, tokenId };
  }

  generateSetupPasswordToken(userId: string) {
    return jwt.sign(
      { sub: userId, type: "setup_password" },
      process.env.JWT_SECRET!,
      {
        expiresIn: "30m",
      },
    );
  }

  verifyRefreshToken(token: string) {
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET!,
      ) as JwtPayload;

      return payload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ExpiredTokenError();
      }

      throw new InvalidTokenError();
    }
  }

  verifyAccessToken(token: string) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      return payload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ExpiredTokenError();
      }

      throw new InvalidTokenError();
    }
  }

  verifySetupPasswordToken(token: string): boolean {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      if (!payload) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
