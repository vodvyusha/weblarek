import { ensureElement } from "../../utils/utils";
import { categoryMap, TCategory } from "../../utils/constants";
import { ICard, Card } from "../View/Card";

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