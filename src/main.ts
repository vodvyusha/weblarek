import './scss/styles.scss';
import { ProductCatalog } from './components/Models/ProductCatalog.ts';
import { Buyer } from './components/Models/Buyer.ts';
import { Cart } from './components/Models/Cart.ts';
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants";
import { apiProducts } from './utils/data.ts';
import { WebLarekApi } from './components/Api/WebLarekApi.ts';

// ===== ProductCatalog =====

const productsModel = new ProductCatalog();
productsModel.setProducts(apiProducts.items);
console.log('Массив товаров из каталога: ', productsModel.getProducts());
console.log('Один товар из каталога: ', productsModel.getProduct(apiProducts.items[0].id));
console.log('Несуществующий товар: ', productsModel.getProduct('1234560'));
productsModel.setPreview(apiProducts.items[0]);
console.log('Выбранный товар: ', productsModel.getPreview());
console.log('Текущее состояние ProductCatalog: ', productsModel);

// ===== Buyer =====

const buyerModel = new Buyer();
console.log('Данные покупателя не заполнены: ', buyerModel.getData());
console.log('Ошибки при не заполненных данных: ', buyerModel.validate());
buyerModel.setData({
  payment: 'card',
  email: 'test@gmail.com',
});
console.log('После первого заполнения: ', buyerModel.getData());
console.log('Ошибки при частичном заполнении данных: ', buyerModel.validate());
buyerModel.setData({
  phone: '+79999999999',
  address: 'г. Екатеринбург, улица Ленина, дом 48, индекс 620014.',
});
console.log('После второго заполнения: ', buyerModel.getData());
console.log('Все поля заполнены: ', buyerModel.validate());
buyerModel.setData({email: 'test@mail.com',});
console.log('Изменение поля email: ', buyerModel.getData());
buyerModel.clear();
console.log('Данные пользователя после очистки: ', buyerModel.getData());

// ===== Cart =====

const cartModel = new Cart();
console.log('Массив товаров, добавленных покупателем в корзину ', cartModel.getItems());
cartModel.addProduct(apiProducts.items[0]);
console.log('Добавили товар в корзину: ', cartModel.getItems());
console.log('Есть ли товар в корзине: ', cartModel.hasProduct(apiProducts.items[0].id));
cartModel.addProduct(apiProducts.items[1]);
console.log('Количество товаров в корзине: ', cartModel.getCount());
console.log("Стоимость товаров:", cartModel.getTotal());
cartModel.removeProduct(apiProducts.items[0]);
console.log('Есть ли удаленный товар в корзине: ', cartModel.hasProduct(apiProducts.items[0].id));
cartModel.clear();
console.log('После очистки корзины: ', cartModel.getItems());

// ===== WebLarekApi =====

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);
webLarekApi.getProducts().then((data) => {
  console.log("Ответ сервера:", data);

  productsModel.setProducts(data.items);

  console.log(
    "Каталог товаров, полученный с сервера:",
    productsModel.getProducts()
  );
})
.catch ((error) => {
  console.log('Ошибка при получении товаров: ', error);
});
