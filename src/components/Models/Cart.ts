import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Cart {
  protected items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addProduct(product: IProduct): void {
    this.items.push(product);

    this.events.emit("cart:change");
  }

  removeProduct(product: IProduct): void {
    this.items = this.items.filter((item) => item.id !== product.id);

    this.events.emit("cart:change");
  }

  clear(): void {
    this.items = [];

    this.events.emit("cart:change");
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasProduct(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
