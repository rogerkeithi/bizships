import { Address } from "@src/domain/user/value-objects/Address";
import { Country } from "@src/domain/user/value-objects/Country";

export class AddressPersistenceMapper {
  static toPersistence(address: Address) {
    return address.toPrimitives();
  }

  static toDomain(raw: AddressPersistenceDto): Address {
    return new Address(
      new Country(raw.country),
      raw.postalCode,
      raw.city,
      raw.street,
      raw.number,
      raw.state,
      raw.district,
      raw.complement,
    );
  }
}

interface AddressPersistenceDto {
  country: string;
  postalCode: string;
  city: string;
  street: string;
  number: string;
  state?: string;
  district?: string;
  complement?: string;
}
