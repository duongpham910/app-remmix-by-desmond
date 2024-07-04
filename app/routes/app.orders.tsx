import { json } from "@remix-run/node";
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import {
  Card,
  EmptyState,
  Layout,
  Page,
  IndexTable,
  Tag,
  InlineStack,
} from "@shopify/polaris";
import saveAs from "file-saver";
import moment from "moment";

import { getOrders } from "../models/Order.server";
import type { Order } from "@prisma/client";
import type { onActionProps } from "~/interfaces/common";
import type { LoaderFunctionArgs} from "@remix-run/node";
import type { NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { formatDateTime, formatOrderNumber, formatPrice } from "~/utils/util";

type HeaderItem = { title: string };

const header: NonEmptyArray<HeaderItem> = [
  { title: "Order Id" },
  { title: "Order Number" },
  { title: "Total Price" },
  { title: "Payment Gateway" },
  { title: "Customer Email" },
  { title: "Customer Full Name" },
  { title: "Customer Address" },
  { title: "Tags" },
  { title: "Created At" },
  { title: "Action" }
] as NonEmptyArray<HeaderItem>;

export async function loader({ request }: LoaderFunctionArgs): Promise<any> {
  const orders = await getOrders();

  return json({
    orders,
  });
}

const exportCSV = (orders: Order[]) => {
  const headerCSV = header.slice(0, -1).map((item: HeaderItem) => item.title).join(",")  + "\n";
  const rows = orders.map(order => {
    const formattedOrder = {
      orderId: order.orderId,
      orderNumber: formatOrderNumber(order.orderNumber),
      totalPrice: formatPrice(parseFloat(order.totalPrice)),
      paymentGateway: order.paymentGateway,
      customerEmail: order.customerEmail,
      customerFullName: order.customerFullName,
      customerAddress: `"${order.customerAddress}"`,
      tags: `"${order.tags}"`,
      createdAt: formatDateTime(order.createdAt)
    };
    return Object.values(formattedOrder).join(",")
  }).join("\n");
  const csvContent = headerCSV + rows

  var blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8'});
  saveAs(blob, `orders_${moment().format("YYYYMMDD")}.csv`);
}

const EmptyOrderState = ({ onAction }: onActionProps) => (
  <EmptyState
    heading="Create unique Order for your page"
    action={{
      content: "Create QR code",
      onAction,
    }}
    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
  >
    <p>Allow customers to create new order</p>
  </EmptyState>
);

const OrderTable = ({ orders }: { orders: Order[]}) => (
  <IndexTable
    resourceName={{
      singular: "Order",
      plural: "Orders",
    }}
    itemCount={orders.length}
    headings={header}
    selectable={false}
  >
    {orders.map((orderObj) => (
      <OrderTableRow key={orderObj.id} order={orderObj} />
    ))}
  </IndexTable>
);

const OrderTableRow = ({ order }: { order: Order }) => (
  <IndexTable.Row id={order.id.toString()} position={order.id}>
    <IndexTable.Cell>{order.orderId}</IndexTable.Cell>
    <IndexTable.Cell>{formatOrderNumber(order.orderNumber)}</IndexTable.Cell>
    <IndexTable.Cell>{formatPrice(parseFloat(order.totalPrice))}</IndexTable.Cell>
    <IndexTable.Cell>{order.paymentGateway}</IndexTable.Cell>
    <IndexTable.Cell>{order.customerFullName}</IndexTable.Cell>
    <IndexTable.Cell>{order.customerEmail}</IndexTable.Cell>
    <IndexTable.Cell>{order.customerAddress}</IndexTable.Cell>
    <IndexTable.Cell>
      <InlineStack gap="100" direction="row" wrap={false}>
        {order.tags.split(",").map((tag, index) => (<Tag key={index}>{tag}</Tag>))}
      </InlineStack>
    </IndexTable.Cell>
    <IndexTable.Cell>
      {formatDateTime(order.createdAt)}
    </IndexTable.Cell>
    <IndexTable.Cell>
      <Link to={`/app/order/${order.id}`}>Edit Tag</Link>
    </IndexTable.Cell>
  </IndexTable.Row>
);

export default function Index() {
  const { orders }: { orders: any[] } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Page fullWidth={true}>
      <ui-title-bar title="Order">
        <button variant="primary" onClick={() => exportCSV(orders)}>Export</button>
      </ui-title-bar>
      <Layout>
          <Layout.Section >
            <Card padding="0">
                {orders.length === 0 ? (
                  <EmptyOrderState onAction={() => navigate("/app/order/new")} />
                ) : (
                  <OrderTable orders={orders} />
                )}
            </Card>
          </Layout.Section>
      </Layout>
    </Page>
  );
}
