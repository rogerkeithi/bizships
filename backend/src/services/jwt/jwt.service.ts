import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { injectable } from "inversify";

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

  verifyRefreshToken(token: string) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as any;
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!) as any;
  }
}
