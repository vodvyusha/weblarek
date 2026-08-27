import { ensureElement } from "../../utils/utils";
import { ICard, Card } from "../View/Card";


interface IBasketCard extends ICard {
  index: number;
}

export class BasketCard extends Card<IBasketCard> {
  protected indexElement: HTMLElement;
  protected deleteButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, onDelete: () => void) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.deleteButtonElement = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    this.deleteButtonElement.addEventListener("click", onDelete);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}