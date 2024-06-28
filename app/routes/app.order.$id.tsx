import { useState } from "react";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
  useNavigate,
} from "@remix-run/react";
import {
  Card,
  Layout,
  Page,
  Text,
  TextField,
  BlockStack,
  PageActions,
} from "@shopify/polaris";

import db from "../db.server";
import { getOrder, validateOrder } from "../models/Order.server";
import { Order } from "@prisma/client";
import { ActionDataProps } from "~/interfaces/common";

export async function loader({ request, params }: LoaderFunctionArgs): Promise<any> {
  if (params.id === "new") {
    return json({
      orderId: "",
      orderNumber: "",
      totalPrice: "",
      paymentGateway: "",
      customerEmail: "",
      customerFullName: "",
      customerAddress: "",
      tags: "",
    });
  }

  const order = await getOrder(Number(params.id))

  return json(order);
}

export async function action({ request, params }: LoaderFunctionArgs) {
  /** @type {any} */
  const data: any = {
    ...Object.fromEntries(await request.formData())
  };

  const errors = validateOrder(data);

  if (errors) {
    return json({ errors }, { status: 422 });
  }

  const response =
    params.id === "new"
      ? await db.order.create({ data })
      : await db.order.update({ where: { id: Number(params.id) }, data });

  return redirect(`/app/order/${response.id}`);
}

export default function OrderForm() {
  const errors = useActionData<ActionDataProps>()?.errors || {};

  const orderRes: any = useLoaderData();
  const [formState, setFormState] = useState<Order>(orderRes);
  const [cleanFormState, setCleanFormState] = useState(orderRes);
  const isDirty = JSON.stringify(formState) !== JSON.stringify(cleanFormState);

  const nav = useNavigation();
  const isSaving =
    nav.state === "submitting" && nav.formData?.get("action") !== "delete";
  const isDeleting =
    nav.state === "submitting" && nav.formData?.get("action") === "delete";

  const navigate = useNavigate();

  const submit = useSubmit();
  function handleSave() {
    const data = {
      orderId: formState.orderId,
      orderNumber: formState.orderNumber || "",
      totalPrice: formState.totalPrice || "",
      paymentGateway: formState.paymentGateway || "",
      customerEmail: formState.customerEmail || "",
      customerFullName: formState.customerFullName || "",
      customerAddress: formState.customerAddress || "",
      tags: formState.tags || "",
    };

    setCleanFormState({ ...formState });
    submit(data, { method: "post" });
  }

  return (
    <Page>
      <ui-title-bar title={orderRes.id ? "Edit Order" : "Create new Order"}>
        <button variant="breadcrumb" onClick={() => navigate("/app")}>
          Order
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="500">
                <Text as={"h2"} variant="headingLg">
                  Order Id
                </Text>
                <TextField
                  id="orderId"
                  label="Order Id"
                  labelHidden
                  autoComplete="off"
                  value={formState.orderId}
                  onChange={(orderId) => setFormState({ ...formState, orderId })}
                  error={errors.orderId}
                />
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="500">
                <Text as={"h2"} variant="headingLg">
                  Order Number
                </Text>
                <TextField
                  id="orderNumber"
                  label="Order Number"
                  labelHidden
                  autoComplete="off"
                  value={formState.orderNumber}
                  onChange={(orderNumber) => setFormState({ ...formState, orderNumber })}
                  error={errors.orderNumber}
                />
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="500">
                <Text as={"h2"} variant="headingLg">
                  Total Price
                </Text>
                <TextField
                  id="totalPrice"
                  label="Total Price"
                  labelHidden
                  autoComplete="off"
                  value={formState.totalPrice}
                  onChange={(totalPrice) => setFormState({ ...formState, totalPrice })}
                  error={errors.totalPrice}
                />
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="500">
                <Text as={"h2"} variant="headingLg">
                  Payment Gateway
                </Text>
                <TextField
                  id="paymentGateway"
                  label="Payment Gateway"
                  labelHidden
                  autoComplete="off"
                  value={formState.paymentGateway}
                  onChange={(paymentGateway) => setFormState({ ...formState, paymentGateway })}
                  error={errors.paymentGateway}
                />
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="500">
                <Text as={"h2"} variant="headingLg">
                  Customer Email
                </Text>
                <TextField
                  id="customerEmail"
                  label="Customer Email"
                  labelHidden
                  autoComplete="off"
                  value={formState.customerEmail}
                  onChange={(customerEmail) => setFormState({ ...formState, customerEmail })}
                  error={errors.customerEmail}
                />
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="500">
                <Text as={"h2"} variant="headingLg">
                  Customer Full Name
                </Text>
                <TextField
                  id="customerFullName"
                  label="Customer Full Name"
                  labelHidden
                  autoComplete="off"
                  value={formState.customerFullName}
                  onChange={(customerFullName) => setFormState({ ...formState, customerFullName })}
                  error={errors.customerFullName}
                />
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="500">
                <Text as={"h2"} variant="headingLg">
                  Customer Address
                </Text>
                <TextField
                  id="customerAddress"
                  label="Customer Address"
                  labelHidden
                  autoComplete="off"
                  value={formState.customerAddress}
                  onChange={(customerAddress) => setFormState({ ...formState, customerAddress })}
                  error={errors.customerAddress}
                />
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="500">
                <Text as={"h2"} variant="headingLg">
                  Tags
                </Text>
                <TextField
                  id="tags"
                  label="Tags"
                  labelHidden
                  autoComplete="off"
                  value={formState.tags}
                  onChange={(tags) => setFormState({ ...formState, tags })}
                  error={errors.tags}
                />
              </BlockStack>
            </Card>
            {/* <Card>
              <BlockStack gap="500">
                <InlineStack align="space-between">
                  <Text as={"h2"} variant="headingLg">
                    Product
                  </Text>
                  {formState.productId ? (
                    <Button variant="plain" onClick={selectProduct}>
                      Change product
                    </Button>
                  ) : null}
                </InlineStack>
                {formState.productId ? (
                  <InlineStack blockAlign="center" gap="500">
                    <Thumbnail
                      source={formState.productImage || ImageIcon}
                      alt={formState.productAlt}
                    />
                    <Text as="span" variant="headingMd" fontWeight="semibold">
                      {formState.productTitle}
                    </Text>
                  </InlineStack>
                ) : (
                  <BlockStack gap="200">
                    <Button onClick={selectProduct} id="select-product">
                      Select product
                    </Button>
                    {errors.productId ? (
                      <InlineError
                        message={errors.productId}
                        fieldID="myFieldID"
                      />
                    ) : null}
                  </BlockStack>
                )}
                <Bleed marginInlineStart="200" marginInlineEnd="200">
                  <Divider />
                </Bleed>
                <InlineStack gap="500" align="space-between" blockAlign="start">
                  <ChoiceList
                    title="Scan destination"
                    choices={[
                      { label: "Link to product page", value: "product" },
                      {
                        label: "Link to checkout page with product in the cart",
                        value: "cart",
                      },
                    ]}
                    selected={[formState.destination]}
                    onChange={(destination) =>
                      setFormState({
                        ...formState,
                        destination: destination[0],
                      })
                    }
                    error={errors.destination}
                  />
                  {qrCode.destinationUrl ? (
                    <Button
                      variant="plain"
                      url={qrCode.destinationUrl}
                      target="_blank"
                    >
                      Go to destination URL
                    </Button>
                  ) : null}
                </InlineStack>
              </BlockStack>
            </Card> */}
          </BlockStack>
        </Layout.Section>
        <Layout.Section variant="oneThird">

        </Layout.Section>
        <Layout.Section>
          <PageActions
            secondaryActions={[
              {
                content: "Delete",
                loading: isDeleting,
                disabled: !orderRes.id || !orderRes || isSaving || isDeleting,
                destructive: true,
                outline: true,
                onAction: () =>
                  submit({ action: "delete" }, { method: "post" }),
              },
            ]}
            primaryAction={{
              content: "Save",
              loading: isSaving,
              disabled: !isDirty || isSaving || isDeleting,
              onAction: handleSave,
            }}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
