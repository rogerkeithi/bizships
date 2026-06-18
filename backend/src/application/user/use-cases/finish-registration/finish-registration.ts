import { inject, injectable } from "inversify";
import { TYPES } from "@src/di/types";
import { IUserRepository } from "@src/domain/user/repositories/use-repository.interface";
import {
  UserNotConfirmedError,
  UserNotFoundError,
} from "@src/shared/errors/user-errors";
import { FinishRegistrationReq } from "./finish-registration.req.dto";
import { Address } from "@src/domain/user/value-objects/Address";
import { Country } from "@src/domain/user/value-objects/Country";
import { Phone } from "@src/domain/user/value-objects/Phone";

@injectable()
export class FinishRegistrationUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(data: FinishRegistrationReq): Promise<void> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (!user.isConfirmed) {
      throw new UserNotConfirmedError();
    }

    const birthDate = new Date(`${data.birthDate}T00:00:00.000Z`);
    const phone = new Phone(data.phone);
    const address = new Address(
      new Country(data.address.country),
      data.address.postalCode,
      data.address.city,
      data.address.street,
      data.address.number,
      data.address.state,
      data.address.district,
      data.address.complement,
    );

    user.finishRegistration({
      firstName: data.firstName,
      lastName: data.lastName,
      birthDate: birthDate,
      phone: phone,
      address: address,
      socialName: data.socialName,
    });

    await this.userRepository.update(user);
  }
}
