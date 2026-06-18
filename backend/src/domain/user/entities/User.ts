import { Email } from "../value-objects/Email";
import { UserType } from "@src/shared/enums/user-type";
import { PasswordHash } from "../value-objects/PasswordHash";
import { Phone } from "../value-objects/Phone";
import { Address } from "../value-objects/Address";
import { Country } from "../value-objects/Country";

export class User {
  public readonly userId: string;

  private _email: Email;
  private _userType: UserType;
  private _status: boolean;
  private _isConfirmed: boolean;
  private _country: Country;
  private _firstName?: string;
  private _lastName?: string;
  private _socialName?: string;
  private _birthDate?: Date;
  private _phone?: Phone;
  private _phoneVerifiedAt?: Date;
  private _address?: Address;
  private _deactivatedAt?: Date;
  private _createdAt?: Date;
  private _updatedAt?: Date;
  private _passwordHash?: PasswordHash;

  private constructor(props: UserProps) {
    this.userId = props.userId;
    this._email = props.email;
    this._userType = props.userType;
    this._status = props.status;
    this._isConfirmed = props.isConfirmed;
    this._country = props.country;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._socialName = props.socialName;
    this._birthDate = props.birthDate;
    this._phone = props.phone;
    this._phoneVerifiedAt = props.phoneVerifiedAt;
    this._address = props.address;
    this._deactivatedAt = props.deactivatedAt;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._passwordHash = props.passwordHash;
  }

  public static create(data: {
    userId: string;
    email: Email;
    country: Country;
  }): User {
    return new User({
      userId: data.userId,
      email: data.email,
      country: data.country,
      userType: UserType.USER,
      status: true,
      isConfirmed: false,
    });
  }

  public static reconstitute(props: UserProps): User {
    return new User(props);
  }

  public setPassword(passwordHash: PasswordHash) {
    this._passwordHash = passwordHash;
  }

  public finishRegistration(data: {
    firstName: string;
    lastName: string;
    birthDate: Date;
    phone: Phone;
    address: Address;
    socialName?: string;
  }) {
    this._firstName = data.firstName;
    this._lastName = data.lastName;
    this._birthDate = data.birthDate;
    this._phone = data.phone;
    this._address = data.address;

    if (data.socialName) this._socialName = data.socialName;
  }

  get email(): Email {
    return this._email;
  }

  get userType(): UserType {
    return this._userType;
  }

  get status(): boolean {
    return this._status;
  }

  get isConfirmed(): boolean {
    return this._isConfirmed;
  }

  get country(): Country {
    return this._country;
  }

  get firstName(): string | undefined {
    return this._firstName;
  }

  get lastName(): string | undefined {
    return this._lastName;
  }

  get socialName(): string | undefined {
    return this._socialName;
  }

  get birthDate(): Date | undefined {
    return this._birthDate;
  }

  get phone(): Phone | undefined {
    return this._phone;
  }

  get phoneVerifiedAt(): Date | undefined {
    return this._phoneVerifiedAt;
  }

  get address(): Address | undefined {
    return this._address;
  }

  get deactivatedAt(): Date | undefined {
    return this._deactivatedAt;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  get passwordHash(): PasswordHash | undefined {
    return this._passwordHash;
  }
}

interface UserProps {
  userId: string;
  email: Email;
  userType: UserType;

  country: Country;
  firstName?: string;
  lastName?: string;
  socialName?: string;
  birthDate?: Date;

  phone?: Phone;
  phoneVerifiedAt?: Date;

  address?: Address;

  status: boolean;
  deactivatedAt?: Date;

  isConfirmed: boolean;

  createdAt?: Date;
  updatedAt?: Date;

  passwordHash?: PasswordHash;
}
