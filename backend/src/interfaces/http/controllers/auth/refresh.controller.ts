import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ok } from "@src/helpers/ok";
import { RefreshUseCase } from "@src/application/auth/use-cases/refresh/refresh";
import { RefreshSchema } from "@src/application/auth/use-cases/refresh/refresh.req.dto";

@injectable()
export default class RefreshController {
  constructor(
    @inject(RefreshUseCase)
    private refreshUseCase: RefreshUseCase,
  ) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const dto = RefreshSchema.parse(req.body);

    const response = await this.refreshUseCase.execute(dto);

    return ok(res, response);
  }
}
