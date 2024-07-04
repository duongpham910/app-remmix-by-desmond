# Order App

The Order App for Shopify is designed to streamline order management for merchants by integrating seamlessly with the store's webhook. It captures and stores orders efficiently, providing a system to track and tag orders,and enabling easy data export for detailed analysis.

## Quick start

### Prerequisites

Before you begin, you'll need the following:

1. **Node.js**: [Download and install](https://nodejs.org/en/download/) Node v22.2.0
2. **Shopify Partner Account**: [Create an account](https://partners.shopify.com/signup) if you don't have one.
3. **Test Store**: Set up either a [development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) or a [Shopify Plus sandbox store](https://help.shopify.com/en/partners/dashboard/managing-stores/plus-sandbox-store) for testing your app.

### Setup

If you used the CLI to create the template, you can skip this section.

Using yarn:

```shell
yarn install
```

Using npm:

```shell
npm install
```


### Local Development

Using yarn:

```shell
yarn dev
```

Using npm:

```shell
npm run dev
```

### Database Desgin

| Column Name      | Datatype | Note |
| ----------- | ----------- | ----------- |
| id      | Int       | Primary Key; Default(Auto Increment) |
| orderId   | String        |  |
| orderNumber   | String        |  |
| totalPrice   | String        |  |
| paymentGateway   | String        |  |
| customerEmail   | String        |  |
| customerFullName   | String        |  |
| customerAddress   | String        |  |
| tags   | String        |
| createdAt   | DateTime        | Default(Now) |
