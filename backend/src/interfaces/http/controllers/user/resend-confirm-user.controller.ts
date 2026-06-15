import { ResendConfirmUserUseCase } from "@src/application/user/use-cases/resend-confirm-user/resend-confirm-user";
import { ResendConfirmUserSchema } from "@src/application/user/use-cases/resend-confirm-user/resend-confirm-user.req.dto";
import { ok } from "@src/helpers/ok";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export default class ResendConfirmUserController {
  constructor(
    @inject(ResendConfirmUserUseCase)
    private resendConfirmUserUseCase: ResendConfirmUserUseCase,
  ) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const dto = ResendConfirmUserSchema.parse(req.body);

    await this.resendConfirmUserUseCase.execute(dto);

    return ok(res);
  }
}
