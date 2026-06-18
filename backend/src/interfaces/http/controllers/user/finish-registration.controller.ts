import { FinishRegistrationUseCase } from "@src/application/user/use-cases/finish-registration/finish-registration";
import { FinishRegistrationSchema } from "@src/application/user/use-cases/finish-registration/finish-registration.req.dto";
import { ok } from "@src/helpers/ok";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export default class FinishRegistrationController {
  constructor(
    @inject(FinishRegistrationUseCase)
    private finishRegistrationUseCase: FinishRegistrationUseCase,
  ) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const dto = FinishRegistrationSchema.parse(req.body);

    await this.finishRegistrationUseCase.execute(dto);

    return ok(res);
  }
}
