import { Country } from "./Country";

export class Address {
  constructor(
    private readonly _country: Country,
    private readonly _city: string,
    private readonly _state: string,
    private readonly _postalCode?: string,
    private readonly _street?: string,
    private readonly _number?: string,
    private readonly _district?: string,
    private readonly _complement?: string,
  ) {
    this.validate();
  }

  public equals(other?: Address): boolean {
    if (!other) {
      return false;
    }

    return (
      JSON.stringify(this.toPrimitives()) ===
      JSON.stringify(other.toPrimitives())
    );
  }

  public toPrimitives() {
    return {
      country: this._country.getValue(),
      postalCode: this._postalCode,
      city: this._city,
      street: this._street,
      number: this._number,
      state: this._state,
      district: this._district,
      complement: this._complement,
    };
  }

  private validate(): void {
    if (!this._city.trim()) {
      throw new Error("INVALID_CITY");
    }

    if (!this._state.trim()) {
      throw new Error("INVALID_STATE");
    }
  }

  get country(): Country {
    return this._country;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get postalCode(): string | undefined {
    return this._postalCode;
  }

  get street(): string | undefined {
    return this._street;
  }

  get number(): string | undefined {
    return this._number;
  }

  get district(): string | undefined {
    return this._district;
  }

  get complement(): string | undefined {
    return this._complement;
  }
}
