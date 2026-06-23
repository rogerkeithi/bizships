import { User } from "@src/domain/user/entities/User";
import { FindUserByEmailRes } from "./find-user-by-email.res.dto";

export class FindUserByEmailMapper {
  static toResponse(user: User): FindUserByEmailRes {
    return {
      userId: user.userId,
      email: user.email.getValue(),
      firstName: user.firstName,
      lastName: user.lastName,
      socialName: user.socialName,
      birthDate: user.birthDate,
      phone: user.phone?.getValue(),
      phoneVerifiedAt: user.phoneVerifiedAt,
      avatarUrl: user.avatarUrl,
      status: user.status,
      isConfirmed: user.isConfirmed,
    };
  }
}
