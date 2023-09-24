-- DropForeignKey
ALTER TABLE "LineItem" DROP CONSTRAINT "LineItem_productId_fkey";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "LineItem" ADD COLUMN     "orderId" TEXT,
ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductField" ADD COLUMN     "remark" TEXT;

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cartId" TEXT,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "socialHandle" TEXT,
    "socialChannel" TEXT,
    "billingAddresssId" TEXT,
    "shippingAddresssId" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "shippingOptionId" TEXT NOT NULL,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "remark" TEXT,
    "subtotal" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "discountTotal" INTEGER NOT NULL,
    "shippingTotal" INTEGER NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'NOT_PAID',

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_externalId_key" ON "Order"("externalId");

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_billingAddresssId_fkey" FOREIGN KEY ("billingAddresssId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingAddresssId_fkey" FOREIGN KEY ("shippingAddresssId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "Currency"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingOptionId_fkey" FOREIGN KEY ("shippingOptionId") REFERENCES "ShippingOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
