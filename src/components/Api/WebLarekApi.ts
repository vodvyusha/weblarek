import {
  IApi,
  IOrder,
  IOrderResult,
  IProductsResponse,
} from "../../types";

export class WebLarekApi {
  constructor(private api: IApi) {}

  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>("/product/");
  }

  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>("/order/", order);
  }
}