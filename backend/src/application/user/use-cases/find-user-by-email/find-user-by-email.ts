import { inject, injectable } from "inversify";
import { TYPES } from "@src/di/types";
import { IUserRepository } from "@src/domain/user/repositories/use-repository.interface";
import { UserNotFoundError } from "@src/shared/errors/user-errors";
import { FindUserByEmailReq } from "./find-user-by-email.req.dto";
import { FindUserByEmailRes } from "./find-user-by-email.res.dto";
import { FindUserByEmailMapper } from "./find-user-by-email.mapper";

@injectable()
export class FindUserByEmailUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(data: FindUserByEmailReq): Promise<FindUserByEmailRes> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const response = FindUserByEmailMapper.toResponse(user);

    return response;
  }
}
