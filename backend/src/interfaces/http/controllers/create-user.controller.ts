import { CreateUserSchema } from "@src/application/user/use-cases/create-user/create-user.req.dto";
import { CreateUserUseCase } from "@src/application/user/use-cases/create-user/create-user";
import { created } from "@src/helpers/created";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export default class CreateUserController {
  constructor(
    @inject(CreateUserUseCase)
    private createUserUseCase: CreateUserUseCase,
  ) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const dto = CreateUserSchema.parse(req.body);

    await this.createUserUseCase.execute(dto);

    return created(res);
  }
}
