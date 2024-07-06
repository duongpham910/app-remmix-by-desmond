import { describe, expect, test } from "vitest";
import { createRemixStub } from "@remix-run/testing";
import { render, screen, waitFor } from "@testing-library/react";
import { json } from "@remix-run/node";
import "@testing-library/jest-dom";
import Orders from "~/routes/app.orders";

import { PolarisTestProvider } from '@shopify/polaris';

describe("OrderList Component", () => {
  test("renders the list of orders with correct format", async () => {
    const RemixStub = createRemixStub([{
      path: "/",
      Component: Orders,
      loader() {
        return json({ orders: [{
          id: 1,
          orderId: "123",
          orderNumber: "1001",
          totalPrice: "50",
          paymentGateway: "manual",
          customerEmail: "john.wick@gmail.com",
          customerFullName: "John Wick",
          customerAddress: "Manhattan, New York",
          tags: "babayaga,boggeyman",
          createAt: new Date()
        }]});
      }
    }]);

    render(
      <PolarisTestProvider >
        <RemixStub />
      </PolarisTestProvider>
    );

    const formatedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(50)

    await waitFor(async () => {
      expect(await screen.findByText("John Wick")).toBeVisible();
      expect(await screen.findByText("#1001")).toBeVisible();
      expect(await screen.findByText(formatedPrice)).toBeVisible();
    });
  });

  test("renders with no order", async () => {
    const RemixStub = createRemixStub([{
      path: "/",
      Component: Orders,
      loader() {
        return json({ orders: []});
      }
    }]);

    render(
      <PolarisTestProvider >
        <RemixStub />
      </PolarisTestProvider>
    );


    await waitFor(async () => {
      expect(await screen.findByText("There are no orders here")).toBeVisible();
    });
  });
});
