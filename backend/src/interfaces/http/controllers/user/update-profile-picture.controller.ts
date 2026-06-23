import { UpdateProfilePictureUseCase } from "@src/application/user/use-cases/update-profile-picture/update-profile-picture";
import { UpdateProfilePictureSchema } from "@src/application/user/use-cases/update-profile-picture/update-profile-picture.req.dto";
import { ok } from "@src/helpers/ok";
import { JwtService } from "@src/services/jwt/jwt.service";
import { InvalidTokenError } from "@src/shared/errors/user-errors";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export default class UpdateProfilePictureController {
  constructor(
    @inject(UpdateProfilePictureUseCase)
    private updateProfilePictureUseCase: UpdateProfilePictureUseCase,
    @inject(JwtService)
    private jwtService: JwtService,
  ) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length)
      : null;

    if (!token) {
      throw new InvalidTokenError();
    }

    const payload = this.jwtService.verifyAccessToken(token);
    const dto = UpdateProfilePictureSchema.parse(req.body);
    const response = await this.updateProfilePictureUseCase.execute({
      ...dto,
      userId: payload.sub,
    });

    return ok(res, response);
  }
}
