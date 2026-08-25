import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {}

export class Modal extends Component<IModal> {
  protected content: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.content = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );

    this.closeButton.addEventListener("click", () => {
      this.events.emit("modal:close");
    });

    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.events.emit("modal:close");
      }
    });
  }

  open(content: HTMLElement) {
    this.content.replaceChildren(content);
    this.container.classList.add("modal_active");
  }

  close() {
    this.container.classList.remove("modal_active");
    this.content.replaceChildren();
  }
}
