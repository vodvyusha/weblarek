import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IForm {
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

      this.events.emit(`${this.formElement.name}:submit`);
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
