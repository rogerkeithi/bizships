import { VerifySetupPasswordCodeUseCase } from "@src/application/user/use-cases/verify-setup-password-code/verify-setup-password-code";
import { VerifySetupPasswordCodeSchema } from "@src/application/user/use-cases/verify-setup-password-code/verify-setup-password-code.req.dto";
import { ok } from "@src/helpers/ok";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export default class VerifySetupPasswordCodeController {
  constructor(
    @inject(VerifySetupPasswordCodeUseCase)
    private verifySetupPasswordUseCase: VerifySetupPasswordCodeUseCase,
  ) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const dto = VerifySetupPasswordCodeSchema.parse(req.body);

    const response = await this.verifySetupPasswordUseCase.execute(dto);

    return ok(res, response);
  }
}
