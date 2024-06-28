-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "totalPrice" TEXT NOT NULL,
    "paymentGateway" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerFullName" TEXT NOT NULL,
    "customerAddress" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
