import { IForm, Form } from "../View/Form";
import { ensureElement, ensureAllElements } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { TPayment } from "../../types";

interface IOrderForm extends IForm {
  payment: TPayment;
  address: string;
}

export class OrderForm extends Form<IOrderForm> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      ".button_alt",
      this.container,
    );

    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    );

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.events.emit("payment:change", {
          payment: button.name,
        });
      });
    });

    this.addressInput.addEventListener("input", () => {
      this.events.emit("order:change", {
        field: "address",
        value: this.addressInput.value,
      });
    });
  }

  set payment(value: TPayment) {
    this.paymentButtons.forEach((button) => {
      if (button.name === value) {
        button.classList.add("button_alt-active");
      } else {
        button.classList.remove("button_alt-active");
      }
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  reset() {
    super.reset();

    this.paymentButtons.forEach((button) => {
      button.classList.remove("button_alt-active");
    });
  }
}
