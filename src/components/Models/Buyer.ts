import { IBuyer, TPayment, TBuyerErrors } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  protected payment: TPayment | null = null;
  protected address = "";
  protected phone = "";
  protected email = "";

  constructor(protected events: IEvents) {}

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

    this.events.emit("buyer:change");
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

    this.events.emit("buyer:change");
  }

  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

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
