import { ensureElement } from "../../utils/utils";
import { categoryMap, TCategory } from "../../utils/constants";
import { ICard, Card } from "../View/Card";
import { IEvents } from "../base/Events";

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

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
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

    this.buttonElement.addEventListener("click", () => {
      this.events.emit("card:action");
    });
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
