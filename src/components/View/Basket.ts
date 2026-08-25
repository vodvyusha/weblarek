import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket> {
  protected itemsElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.itemsElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );

    this.orderButton.addEventListener("click", () => {
      this.events.emit("basket:order");
    });
  }

  set items(value: HTMLElement[]) {
    this.itemsElement.replaceChildren(...value);
  }

  set total(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

  set orderButtonDisabled(value: boolean) {
    this.orderButton.disabled = value;
  }
}
