import { ConfirmUserUseCase } from "@src/application/user/use-cases/confirm-user/confirm-user";
import { ConfirmUserSchema } from "@src/application/user/use-cases/confirm-user/confirm-user.req.dto";
import { ok } from "@src/helpers/ok";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export default class ConfirmUserController {
  constructor(
    @inject(ConfirmUserUseCase)
    private confirmUserUseCase: ConfirmUserUseCase,
  ) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const dto = ConfirmUserSchema.parse(req.body);

    const response = await this.confirmUserUseCase.execute(dto);

    return ok(res, response);
  }
}
