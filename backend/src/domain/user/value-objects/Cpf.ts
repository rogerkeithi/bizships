import { InvalidCpfError } from "@src/shared/errors/user-errors";

export class Cpf {
  private readonly value: string;

  constructor(cpf: string) {
    const normalizedCpf = this.normalize(cpf);

    if (!this.isValid(normalizedCpf)) {
      throw new InvalidCpfError();
    }

    this.value = normalizedCpf;
  }

  public getValue(): string {
    return this.value;
  }

  private normalize(cpf: string): string {
    return cpf.replace(/\D/g, "");
  }

  private isValid(cpf: string): boolean {
    if (cpf.length !== 11) {
      return false;
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    const firstDigit = this.calculateDigit(cpf.substring(0, 9), 10);
    const secondDigit = this.calculateDigit(cpf.substring(0, 10), 11);

    return firstDigit === Number(cpf[9]) && secondDigit === Number(cpf[10]);
  }

  private calculateDigit(cpf: string, weight: number): number {
    const total = cpf.split("").reduce((sum, digit) => {
      return sum + Number(digit) * weight--;
    }, 0);

    const remainder = total % 11;

    return remainder < 2 ? 0 : 11 - remainder;
  }

  public equals(other: Cpf): boolean {
    return this.value === other.value;
  }
}
