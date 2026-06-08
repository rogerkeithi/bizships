import { SetupPasswordUseCase } from "@src/application/user/use-cases/setup-password/setup-password";
import { SetupPasswordSchema } from "@src/application/user/use-cases/setup-password/setup-password.req.dto";
import { ok } from "@src/helpers/ok";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export default class SetupPasswordController {
  constructor(
    @inject(SetupPasswordUseCase)
    private setupPasswordUseCase: SetupPasswordUseCase,
  ) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const dto = SetupPasswordSchema.parse(req.body);

    await this.setupPasswordUseCase.execute(dto);

    return ok(res);
  }
}
