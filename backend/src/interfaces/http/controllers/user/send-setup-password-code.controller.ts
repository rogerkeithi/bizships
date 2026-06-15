import { SendSetupPasswordCodeUseCase } from "@src/application/user/use-cases/send-setup-password-code/send-setup-password-code";
import { SendSetupPasswordCodeSchema } from "@src/application/user/use-cases/send-setup-password-code/send-setup-password-code.req.dto";
import { ok } from "@src/helpers/ok";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export default class SendSetupPasswordCodeController {
  constructor(
    @inject(SendSetupPasswordCodeUseCase)
    private sendsetupPasswordCodeUseCase: SendSetupPasswordCodeUseCase,
  ) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const dto = SendSetupPasswordCodeSchema.parse(req.body);

    await this.sendsetupPasswordCodeUseCase.execute(dto);

    return ok(res);
  }
}
