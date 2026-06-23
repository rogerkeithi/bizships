import { User } from "@src/domain/user/entities/User";
import { Email } from "@src/domain/user/value-objects/Email";
import { Country } from "@src/domain/user/value-objects/Country";
import { Phone } from "@src/domain/user/value-objects/Phone";
import { PasswordHash } from "@src/domain/user/value-objects/PasswordHash";
import { AddressPersistenceMapper } from "./address-persistence-mapper";

export class UserPersistenceMapper {
  static toPersistence(user: User) {
    return {
      userId: user.userId,
      email: user.email.getValue(),
      userType: user.userType,
      country: user.country.getValue(),
      status: user.status,
      isConfirmed: user.isConfirmed,

      firstName: user.firstName,
      lastName: user.lastName,
      socialName: user.socialName,

      birthDate: user.birthDate,
      phone: user.phone?.getValue(),
      phoneVerifiedAt: user.phoneVerifiedAt,
      googleId: user.googleId,
      avatarUrl: user.avatarUrl,
      authProvider: user.authProvider,

      passwordHash: user.passwordHash?.getValue(),
      deactivatedAt: user.deactivatedAt,
      address: user.address
        ? AddressPersistenceMapper.toPersistence(user.address)
        : undefined,
    };
  }

  static toDomain(raw: any): User {
    return User.reconstitute({
      userId: raw.userId,
      email: new Email(raw.email),
      userType: raw.userType,
      country: new Country(raw.country),
      status: raw.status,
      isConfirmed: raw.isConfirmed,
      firstName: raw.firstName,
      lastName: raw.lastName,
      socialName: raw.socialName,
      birthDate: raw.birthDate,
      phone: raw.phone ? new Phone(raw.phone) : undefined,
      phoneVerifiedAt: raw.phoneVerifiedAt,
      googleId: raw.googleId,
      avatarUrl: raw.avatarUrl,
      authProvider: raw.authProvider,
      passwordHash: raw.passwordHash
        ? new PasswordHash(raw.passwordHash)
        : undefined,
      address: raw.address
        ? AddressPersistenceMapper.toDomain(raw.address)
        : undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deactivatedAt: raw.deactivatedAt,
    });
  }
}
