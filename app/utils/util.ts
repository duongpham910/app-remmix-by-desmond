import moment from "moment";

const locale = "en-US";
const regionCurrency = "usd";

export function formatPrice(price: number) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: regionCurrency,
  }).format(price);
}

export function formatDateTime(time: Date) {
  return moment(time).format("YYYY/MM/DD HH:mm:ss");
}

export function formatOrderNumber(orderNumber: string) {
  return `#${orderNumber}`;
}
