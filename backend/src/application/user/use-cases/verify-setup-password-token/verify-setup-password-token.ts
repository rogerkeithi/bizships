import { inject, injectable } from "inversify";
import { JwtService } from "@src/services/jwt/jwt.service";
import { VerifySetupPasswordTokenReq } from "./verify-setup-password-token.req.dto";
import { VerifySetupPasswordTokenRes } from "./verify-setup-password-token.res.dto";

@injectable()
export class VerifySetupPasswordTokenUseCase {
  constructor(
    @inject(JwtService)
    private jwtService: JwtService,
  ) {}
  async execute(
    data: VerifySetupPasswordTokenReq,
  ): Promise<VerifySetupPasswordTokenRes> {
    const response = this.jwtService.verifySetupPasswordToken(
      data.setupPasswordToken,
    );
    return {
      valid: response,
    };
  }
}
