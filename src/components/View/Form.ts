import { ensureElement, ensureAllElements } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { TPayment } from "../../types";

interface IForm {
  valid: boolean;
  errors: string;
}

export class Form<T extends IForm> extends Component<T> {
  protected formElement: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLFormElement,
  ) {
    super(container);

    this.formElement = this.container as HTMLFormElement;
    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );
    this.errorsElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );

    this.formElement.addEventListener("submit", (event) => {
      event.preventDefault();

      this.events.emit("form:submit", {
        form: this.formElement.name,
      });
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }

  reset() {
    this.formElement.reset();
    this.errors = "";
  }
}

interface IOrderForm extends IForm {
  payment: "card" | "cash";
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

interface IContactsForm extends IForm {
  email: string;
  phone: string;
}
export class ContactsForm extends Form<IContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );

    this.emailInput.addEventListener("input", () => {
      this.events.emit("contacts:change", {
        field: "email",
        value: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit("contacts:change", {
        field: "phone",
        value: this.phoneInput.value,
      });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
