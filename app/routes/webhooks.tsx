import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { deleteOrder, saveOrder, updateOrder } from "~/models/Order.server";

const getCustomerFullName = (customer: any) => {
  if (!customer) return "";

  const firstName = customer.first_name || ""
  const lastName = customer.last_name || ""

  return `${firstName} ${lastName}`.trim();
}

const getCustomerAddress = (address: any) => {
  if (!address) return "";

  const address1 = address.address1 || ""
  const city = address.city || ""
  const province = address.province || ""
  const country = address.country || ""
  const addressParts = [address1, city, province, country];

  return addressParts.filter(part => part).join(", ");
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(request);

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  let customerFullName = ''
  let customerAddress = ''

  // The topics handled here should be declared in the shopify.app.toml.
  // More info: https://shopify.dev/docs/apps/build/cli-for-apps/app-configuration
  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }

      break;
    case "ORDERS_CREATE":
      console.log("ORDERS_CREATE");
      console.log(payload)
      customerFullName = getCustomerFullName(payload.customer)
      customerAddress = getCustomerAddress(payload.customer?.default_address)
      await saveOrder({
        orderId: payload.id.toString(),
        orderNumber: payload.order_number.toString(),
        totalPrice: payload.total_price.toString(),
        paymentGateway: payload.payment_gateway_names.join(", "),
        customerEmail: payload.customer?.email || "",
        customerFullName,
        customerAddress,
        tags: payload.tags,
      })
      break;
    case "ORDERS_UPDATED":
      console.log("ORDERS_UPDATE");
      customerFullName = getCustomerFullName(payload.customer)
      customerAddress = getCustomerAddress(payload.customer?.default_address)
      await updateOrder({
        orderId: payload.id.toString(),
        orderNumber: payload.order_number.toString(),
        totalPrice: payload.total_price.toString(),
        paymentGateway: payload.payment_gateway_names.join(", "),
        customerEmail: payload.customer?.email || "",
        customerFullName,
        customerAddress,
        tags: payload.tags,
      })
      break;
    case "ORDERS_DELETE":
      console.log("ORDERS_DELETE");
      console.log(payload);
      await deleteOrder(payload.id.toString())
      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
