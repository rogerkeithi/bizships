import { GoogleLoginUseCase } from "@src/application/auth/use-cases/google-login/google-login";
import { GoogleLoginSchema } from "@src/application/auth/use-cases/google-login/google-login.req.dto";
import { ok } from "@src/helpers/ok";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export default class GoogleLoginController {
  constructor(
    @inject(GoogleLoginUseCase)
    private googleLoginUseCase: GoogleLoginUseCase,
  ) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const dto = GoogleLoginSchema.parse(req.body);

    const response = await this.googleLoginUseCase.execute(dto);

    return ok(res, response);
  }
}
