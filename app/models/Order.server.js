// import invariant from "tiny-invariant";
import db from "../db.server";

export async function getOrder(id) {
  const orderRecord = await db.order.findFirst({ where: { id } });

  if (!orderRecord) {
    return null;
  }

  return orderRecord;
}

export async function getOrders() {
  const orders = await db.order.findMany({
    orderBy: { id: "desc" },
  });

  return orders;
}

export function validateOrder(data) {
  const errors = {};

  if (!data.orderId) {
    errors.orderId = "orderID is required";
  }

  if (!data.orderNumber) {
    errors.orderNumber = "Order number is required";
  }

  if (!data.totalPrice) {
    errors.totalPrice = "Total price is required";
  }

  if (!data.paymentGateway) {
    errors.paymentGateway = "Payment gateway is required";
  }

  if (!data.customerEmail) {
    errors.customerEmail = "Customer email is required";
  }

  if (!data.customerFullName) {
    errors.customerFullName = "Customer full name is required";
  }

  if (!data.customerAddress) {
    errors.customerAddress = "Customer adress is required";
  }

  if (!data.tags) {
    errors.tags = "Tags is required";
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}
