import { describe, expect, test, vi } from "vitest";
import { createRemixStub } from "@remix-run/testing";
import { render, screen, waitFor } from "@testing-library/react";
import { json } from "@remix-run/node";
import "@testing-library/jest-dom";
import OrderId from "~/routes/app.order.$id";

import { PolarisTestProvider } from '@shopify/polaris';

vi.mock("@shopify/shopify-app-remix/server", async (importOriginal) => {
  const actual: any = await importOriginal()

  return {
    ...actual,
    shopifyApp: () => {
      return {
        addDocumentResponseHeaders: {},
        authenticate: {},
        unauthenticated: {},
        login: {},
        registerWebhooks: {},
        sessionStorage: {}
      }
    }
  }
})

describe("OrderId Component", () => {
  test("renders the list of orders with correct format", async () => {
    const RemixStub = createRemixStub([{
      path: "/",
      Component: OrderId,
      loader() {
        return json({
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
        });
      }
    }]);

    render(
      <PolarisTestProvider >
        <RemixStub />
      </PolarisTestProvider>
    );

    await waitFor(async () => {
      expect(await screen.findByText("babayaga")).toBeVisible();
      expect(await screen.findByText("boggeyman")).toBeVisible();

      const tagElement = screen.getByPlaceholderText('Search tags');
      expect(tagElement).toBeVisible();
      expect(tagElement).toBeInTheDocument();
    });
  });

});
