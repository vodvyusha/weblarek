import "./scss/styles.scss";
import { IOrder } from "./types";
import { ProductCatalog } from "./components/Models/ProductCatalog.ts";
import { Buyer } from "./components/Models/Buyer.ts";
import { Cart } from "./components/Models/Cart.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL, CDN_URL } from "./utils/constants";
import { WebLarekApi } from "./components/Api/WebLarekApi.ts";
import { EventEmitter } from "./components/base/Events";
import { CatalogCard } from "./components/View/CatalogCard.ts";
import { PreviewCard } from "./components/View/PreviewCard.ts";
import { BasketCard } from "./components/View/BasketCard.ts";
import { OrderForm } from "./components/View/OrderForm.ts";
import { ContactsForm } from "./components/View/ContactsForm.ts";
import { Modal } from "./components/View/Modal.ts";
import { Success } from "./components/View/Success.ts";
import { Header } from "./components/View/Header.ts";
import { Gallery } from "./components/View/Gallery.ts";
import { Basket } from "./components/View/Basket.ts";
import { cloneTemplate, ensureElement } from "./utils/utils.ts";
import {
  TPayment,
  TOrderChange,
  TContactsChange,
  TCardSelect,
  TBasketItemDelete,
} from "./types/index.ts";

const events = new EventEmitter();

const productsModel = new ProductCatalog(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

const catalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const basketCardTemplate = ensureElement<HTMLTemplateElement>("#card-basket");

const headerElement = ensureElement<HTMLElement>(".header");
const galleryElement = ensureElement<HTMLElement>(".gallery");
const modalElement = ensureElement<HTMLElement>(".modal");
const basketElement = cloneTemplate<HTMLElement>("#basket");
const orderElement = cloneTemplate<HTMLFormElement>("#order");
const contactsElement = cloneTemplate<HTMLFormElement>("#contacts");
const successElement = cloneTemplate<HTMLElement>("#success");
const previewElement = cloneTemplate<HTMLElement>("#card-preview");

const header = new Header(events, headerElement);
const gallery = new Gallery(galleryElement);
const modal = new Modal(events, modalElement);
const basket = new Basket(events, basketElement);
const orderForm = new OrderForm(events, orderElement);
const contactsForm = new ContactsForm(events, contactsElement);
const success = new Success(events, successElement);
const previewCard = new PreviewCard(events, previewElement);

header.counter = cartModel.getCount();

// ===== Модальное окно =====

events.on("modal:close", () => {
  modal.close();
});

// ===== Каталог =====

events.on("catalog:change", () => {
  const products = productsModel.getProducts();

  const cards = products.map((product) => {
    const cardElement = cloneTemplate<HTMLElement>(catalogTemplate);

    const card = new CatalogCard(cardElement, () => {
      events.emit("card:select", { id: product.id });
    });
    return card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: `${CDN_URL}${product.image}`,
    });
  });

  gallery.catalog = cards;
});

events.on<TCardSelect>("card:select", ({ id }) => {
  const product = productsModel.getProduct(id);

  if (!product) return;

  productsModel.setPreview(product);
});

events.on("preview:change", () => {
  const product = productsModel.getPreview();

  if (!product) return;

  const preview = previewCard.render({
    title: product.title,
    price: product.price,
    category: product.category,
    image: `${CDN_URL}${product.image}`,
    description: product.description,
  });

  const isAvailable = product.price !== null;
  const isInCart = cartModel.hasProduct(product.id);

  previewCard.buttonText = !isAvailable
    ? "Недоступно"
    : isInCart
      ? "Удалить из корзины"
      : "В корзину";

  previewCard.buttonState = isAvailable;

  modal.open(preview);
});

events.on("card:action", () => {
  const product = productsModel.getPreview();

  if (!product) return;

  if (cartModel.hasProduct(product.id)) {
    cartModel.removeProduct(product);
  } else {
    cartModel.addProduct(product);
  }

  modal.close();
});

// ===== Корзина =====

const renderBasket = () => {
  const items = cartModel.getItems();

  const cards = items.map((product, index) => {
    const cardElement = cloneTemplate<HTMLElement>(basketCardTemplate);

    const card = new BasketCard(cardElement, () => {
      events.emit("basket:item-delete", { id: product.id });
    });

    return card.render({
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

  basket.items = cards;
  basket.total = cartModel.getTotal();
  basket.orderButtonDisabled = items.length === 0;
};

events.on("basket:open", () => {
  modal.open(basket.render());
});

events.on<TBasketItemDelete>("basket:item-delete", ({ id }) => {
  const product = productsModel.getProduct(id);

  if (!product) return;

  cartModel.removeProduct(product);
});

renderBasket();

events.on("basket:order", () => {
  const errors = buyerModel.validate();

  const orderErrors = [errors.payment, errors.address].filter(Boolean);

  orderForm.valid = orderErrors.length === 0;
  orderForm.errors = orderErrors.join(", ");

  modal.open(orderForm.render());
});

// ===== Изменение корзины =====

events.on("cart:change", () => {
  header.counter = cartModel.getCount();
  renderBasket();
});

// ===== Данные покупателя =====

events.on("payment:change", ({ payment }: { payment: TPayment }) => {
  buyerModel.setData({ payment });
});

events.on("order:change", ({ field, value }: TOrderChange) => {
  buyerModel.setData({
    [field]: value,
  });
});

events.on("contacts:change", ({ field, value }: TContactsChange) => {
  buyerModel.setData({
    [field]: value,
  });
});

events.on("buyer:change", () => {
  const buyer = buyerModel.getData();

  if (buyer.payment) {
    orderForm.payment = buyer.payment;
  }

  const errors = buyerModel.validate();

  const orderErrors = [errors.payment, errors.address].filter(Boolean);

  orderForm.valid = orderErrors.length === 0;
  orderForm.errors = orderErrors.join(", ");

  const contactsErrors = [errors.email, errors.phone].filter(Boolean);

  contactsForm.valid = contactsErrors.length === 0;
  contactsForm.errors = contactsErrors.join(", ");
});

// ===== Оформление заказа =====

events.on("order:submit", () => {
  const errors = buyerModel.validate();

  if (errors.payment || errors.address) {
    orderForm.errors = [errors.payment, errors.address]
      .filter(Boolean)
      .join(", ");

    return;
  }

  modal.open(contactsForm.render());
});

events.on("contacts:submit", () => {
  const errors = buyerModel.validate();

  if (Object.keys(errors).length > 0) {
    contactsForm.errors = Object.values(errors).filter(Boolean).join(", ");

    return;
  }

  const buyer = buyerModel.getData();

  const order: IOrder = {
    ...buyer,
    total: cartModel.getTotal(),
    items: cartModel.getItems().map((item) => item.id),
  };

  webLarekApi
    .createOrder(order)
    .then((result) => {
      success.total = result.total;

      cartModel.clear();
      buyerModel.clear();

      orderForm.reset();
      contactsForm.reset();

      modal.open(success.render());
    })
    .catch((error) => {
      contactsForm.errors = String(error);
    });
});

// ===== Успешное оформление =====

events.on("order-success:close", () => {
  modal.close();
});

// ===== Запуск приложения =====

webLarekApi
  .getProducts()
  .then((data) => {
    productsModel.setProducts(data.items);
  })
  .catch((error) => {
    console.error(error);
  });
