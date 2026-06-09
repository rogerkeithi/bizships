import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { LogoutUseCase } from "@src/application/auth/use-cases/logout/logout";
import { LogoutSchema } from "@src/application/auth/use-cases/logout/logout.req.dto";
import { noContent } from "@src/helpers/no-content";

@injectable()
export default class LogoutController {
  constructor(
    @inject(LogoutUseCase)
    private logoutUseCase: LogoutUseCase,
  ) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const dto = LogoutSchema.parse(req.body);

    await this.logoutUseCase.execute(dto);

    return noContent(res);
  }
}
