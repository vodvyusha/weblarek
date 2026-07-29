import { IProduct } from "../../types";

export class Cart {
  protected items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  addProduct(product: IProduct): void {
    this.items.push(product);
  }

  removeProduct(product: IProduct): void {
    this.items = this.items.filter(item => item.id !== product.id);
  }

  clear(): void {
    this.items = [];
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasProduct(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}