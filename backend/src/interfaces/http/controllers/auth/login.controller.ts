import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { LoginUseCase } from "@src/application/auth/use-cases/login/login";
import { LoginSchema } from "@src/application/auth/use-cases/login/login.req.dto";
import { ok } from "@src/helpers/ok";

@injectable()
export default class LoginController {
  constructor(
    @inject(LoginUseCase)
    private loginUseCase: LoginUseCase,
  ) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const dto = LoginSchema.parse(req.body);

    const response = await this.loginUseCase.execute(dto);

    return ok(res, response);
  }
}
