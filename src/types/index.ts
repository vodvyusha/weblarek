export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IOrder extends IBuyer {
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}

export type TPayment = "card" | "cash";

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export type TFormSubmit = {
  form: "order" | "contacts";
};

export type TOrderChange = {
  field: "address";
  value: string;
};

export type TContactsChange = {
  field: "email" | "phone";
  value: string;
};

import { TCategory } from "../utils/constants";

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: TCategory;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}
