import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import {
  Card,
  EmptyState,
  Layout,
  Page,
  IndexTable,
} from "@shopify/polaris";

import { getOrders } from "../models/Order.server";
import { Order } from "@prisma/client";
import { onActionProps } from "~/interfaces/common";

export async function loader({ request }: LoaderFunctionArgs): Promise<any> {
  const orders = await getOrders();

  return json({
    orders,
  });
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
    headings={[
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
    ]}
    selectable={false}
  >
    {orders.map((orderObj) => (
      <OrderTableRow key={orderObj.id} order={orderObj} />
    ))}
  </IndexTable>
);

const OrderTableRow = ({ order }: { order: Order }) => (
  <IndexTable.Row id={order.id.toString()} position={order.id}>
    <IndexTable.Cell>
      <Link to={`orders/${order.id}`}>{order.orderId}</Link>
    </IndexTable.Cell>
    <IndexTable.Cell>{order.orderNumber}</IndexTable.Cell>
    <IndexTable.Cell>{order.totalPrice}</IndexTable.Cell>
    <IndexTable.Cell>{order.paymentGateway}</IndexTable.Cell>
    <IndexTable.Cell>{order.customerFullName}</IndexTable.Cell>
    <IndexTable.Cell>{order.customerEmail}</IndexTable.Cell>
    <IndexTable.Cell>{order.customerAddress}</IndexTable.Cell>
    <IndexTable.Cell>{order.tags}</IndexTable.Cell>
    <IndexTable.Cell>
      {new Date(order.createdAt).toDateString()}
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
    <Page>
      <ui-title-bar title="Order">
        <button variant="primary" onClick={() => navigate("/app/order/new")}>
          Create Order
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
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
