import { IBuyer, TPayment } from "../../types";

export class Buyer {
  protected payment: TPayment = null;
  protected address = "";
  protected phone = "";
  protected email = "";

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }

    if (data.address !== undefined) {
      this.address = data.address;
    }

    if (data.phone !== undefined) {
      this.phone = data.phone;
    }

    if (data.email !== undefined) {
      this.email = data.email;
    }
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clear(): void {
    this.payment = null;
    this.address = "";
    this.phone = "";
    this.email = "";
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.payment) {
      errors.payment = "Выберите способ оплаты";
    }

    if (!this.address) {
      errors.address = "Введите адрес";
    }

    if (!this.phone) {
      errors.phone = "Введите номер телефона";
    }

    if (!this.email) {
      errors.email = "Введите email";
    }

    return errors;
  }
}