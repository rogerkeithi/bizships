import { VerifySetupPasswordTokenUseCase } from "@src/application/user/use-cases/verify-setup-password-token/verify-setup-password-token";
import { VerifySetupPasswordTokenSchema } from "@src/application/user/use-cases/verify-setup-password-token/verify-setup-password-token.req.dto";
import { ok } from "@src/helpers/ok";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export default class VerifySetupPasswordTokenController {
  constructor(
    @inject(VerifySetupPasswordTokenUseCase)
    private verifySetupPasswordUseCase: VerifySetupPasswordTokenUseCase,
  ) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const dto = VerifySetupPasswordTokenSchema.parse(req.body);

    const response = await this.verifySetupPasswordUseCase.execute(dto);

    return ok(res, response);
  }
}
