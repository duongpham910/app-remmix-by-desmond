import type { orderDataProps, payloadProps } from "~/interfaces/common";
import db from "../db.server";

export async function getOrder(id: number) {
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

export function validateOrder(data: orderDataProps) {
  const errors: orderDataProps = {};

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

export async function saveOrder(payload: payloadProps) {
  await prisma.order.create({
    data: payload
  })
}

export async function updateOrder(payload: payloadProps) {
  const existOrder = await prisma.order.findFirst({ where: { orderId: payload.orderId } });

  if(existOrder) {
    await prisma.order.update({
      where: {
        id: existOrder.id,
      },
      data: payload
    })
  } else {
    console.log("Not Found Order Id: ", payload.orderId)
  }
}

export async function deleteOrder(orderId: string) {
  const existOrder = await prisma.order.findFirst({ where: { orderId } });

  if(existOrder) {
    await prisma.order.delete({ where: { id: existOrder.id } });
  } else {
    console.log("Not Found Order Id: ", orderId)
  }
}
