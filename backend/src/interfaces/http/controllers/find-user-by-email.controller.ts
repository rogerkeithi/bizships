import { FindUserByEmailUseCase } from "@src/application/user/use-cases/find-user-by-email/find-user-by-email";
import { FindUserByEmailSchema } from "@src/application/user/use-cases/find-user-by-email/find-user-by-email.req.dto";
import { ok } from "@src/helpers/ok";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export default class FindUserByEmailController {
  constructor(
    @inject(FindUserByEmailUseCase)
    private findUserByEmailUseCase: FindUserByEmailUseCase,
  ) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const dto = FindUserByEmailSchema.parse(req.body);

    const response = await this.findUserByEmailUseCase.execute(dto);

    return ok(res, response);
  }
}
