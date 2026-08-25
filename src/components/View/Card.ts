import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { categoryMap, TCategory } from "../../utils/constants";

interface ICard {
  title: string;
  price: number | null;
}

export class Card<T extends ICard> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container,
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container,
    );
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent =
      value === null ? "Бесценно" : `${value} синапсов`;
  }
}

interface ICatalogCard extends ICard {
  category: TCategory;
  image: string;
}

export class CatalogCard extends Card<ICatalogCard> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

    this.container.addEventListener("click", onClick);
  }

  set category(value: TCategory) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = `card__category ${categoryMap[value]}`;
  }

  set image(value: string) {
    this.imageElement.src = value;
  }
}

interface IPreviewCard extends ICard {
  category: TCategory;
  image: string;
  description: string;
}

export class PreviewCard extends Card<IPreviewCard> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    this.buttonElement.addEventListener("click", onClick);
  }

  set category(value: TCategory) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = `card__category ${categoryMap[value]}`;
  }

  set image(value: string) {
    this.imageElement.src = value;
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonState(value: boolean) {
    this.buttonElement.disabled = !value;
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }
}

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
