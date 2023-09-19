-- CreateTable
CREATE TABLE "Translation" (
    "id" TEXT NOT NULL,
    "text" JSONB NOT NULL,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "nameTranslationId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductField" (
    "id" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "nameTranslationId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductFieldToProduct" (
    "productId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProductFieldToProduct_pkey" PRIMARY KEY ("productId","fieldId")
);

-- CreateTable
CREATE TABLE "ProductFieldOption" (
    "id" TEXT NOT NULL,
    "nameTranslationId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductFieldOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariantFieldValue" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "fieldOptionId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductVariantFieldValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCollection" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameTranslationId" TEXT NOT NULL,

    CONSTRAINT "ProductCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "socialHandle" TEXT,
    "socialChannel" TEXT,
    "billingAddresssId" TEXT,
    "shippingAddresssId" TEXT,
    "currencyCode" TEXT NOT NULL,
    "shippingOptionId" TEXT,
    "deliveryDate" TIMESTAMP(3),
    "remark" TEXT,
    "subtotal" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "discountTotal" INTEGER NOT NULL,
    "shippingTotal" INTEGER NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineItem" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "productVariantId" TEXT,
    "cartId" TEXT,
    "subtotal" INTEGER NOT NULL,
    "shippingTotal" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "LineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartProductFieldValue" (
    "id" TEXT NOT NULL,
    "lineItemId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "fieldOptionId" TEXT,
    "fieldValue" TEXT,
    "fieldOptionAssetId" TEXT,

    CONSTRAINT "CartProductFieldValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "address1" TEXT NOT NULL,
    "address2" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "code" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "nameTranslationId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MoneyAmount" (
    "id" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "MoneyAmount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingOption" (
    "id" TEXT NOT NULL,
    "nameTranslationId" TEXT NOT NULL,
    "instructionsTranslationId" TEXT,
    "priceType" TEXT NOT NULL,
    "priceId" TEXT,
    "shippingProviderId" TEXT,

    CONSTRAINT "ShippingOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingProvider" (
    "id" TEXT NOT NULL,
    "nameTranslationId" TEXT NOT NULL,

    CONSTRAINT "ShippingProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentOption" (
    "id" TEXT NOT NULL,
    "nameTranslationId" TEXT NOT NULL,
    "instructionsTranslationId" TEXT,
    "paymentProviderId" TEXT,

    CONSTRAINT "PaymentOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentProvider" (
    "id" TEXT NOT NULL,
    "nameTranslationId" TEXT NOT NULL,

    CONSTRAINT "PaymentProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AssetToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToProductCollection" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductFieldOptionToProductVariant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MoneyAmountToProductField" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MoneyAmountToProductVariant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MoneyAmountToProductFieldOption" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MoneyAmountToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductCollection_slug_key" ON "ProductCollection"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_code_key" ON "Currency"("code");

-- CreateIndex
CREATE UNIQUE INDEX "_AssetToProduct_AB_unique" ON "_AssetToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_AssetToProduct_B_index" ON "_AssetToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToProductCollection_AB_unique" ON "_ProductToProductCollection"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToProductCollection_B_index" ON "_ProductToProductCollection"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductFieldOptionToProductVariant_AB_unique" ON "_ProductFieldOptionToProductVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductFieldOptionToProductVariant_B_index" ON "_ProductFieldOptionToProductVariant"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MoneyAmountToProductField_AB_unique" ON "_MoneyAmountToProductField"("A", "B");

-- CreateIndex
CREATE INDEX "_MoneyAmountToProductField_B_index" ON "_MoneyAmountToProductField"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MoneyAmountToProductVariant_AB_unique" ON "_MoneyAmountToProductVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_MoneyAmountToProductVariant_B_index" ON "_MoneyAmountToProductVariant"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MoneyAmountToProductFieldOption_AB_unique" ON "_MoneyAmountToProductFieldOption"("A", "B");

-- CreateIndex
CREATE INDEX "_MoneyAmountToProductFieldOption_B_index" ON "_MoneyAmountToProductFieldOption"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MoneyAmountToProduct_AB_unique" ON "_MoneyAmountToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_MoneyAmountToProduct_B_index" ON "_MoneyAmountToProduct"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductField" ADD CONSTRAINT "ProductField_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFieldToProduct" ADD CONSTRAINT "ProductFieldToProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFieldToProduct" ADD CONSTRAINT "ProductFieldToProduct_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "ProductField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFieldOption" ADD CONSTRAINT "ProductFieldOption_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFieldOption" ADD CONSTRAINT "ProductFieldOption_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "ProductField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariantFieldValue" ADD CONSTRAINT "ProductVariantFieldValue_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariantFieldValue" ADD CONSTRAINT "ProductVariantFieldValue_fieldOptionId_fkey" FOREIGN KEY ("fieldOptionId") REFERENCES "ProductFieldOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCollection" ADD CONSTRAINT "ProductCollection_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_billingAddresssId_fkey" FOREIGN KEY ("billingAddresssId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_shippingAddresssId_fkey" FOREIGN KEY ("shippingAddresssId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "Currency"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_shippingOptionId_fkey" FOREIGN KEY ("shippingOptionId") REFERENCES "ShippingOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProductFieldValue" ADD CONSTRAINT "CartProductFieldValue_lineItemId_fkey" FOREIGN KEY ("lineItemId") REFERENCES "LineItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProductFieldValue" ADD CONSTRAINT "CartProductFieldValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "ProductField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProductFieldValue" ADD CONSTRAINT "CartProductFieldValue_fieldOptionId_fkey" FOREIGN KEY ("fieldOptionId") REFERENCES "ProductFieldOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProductFieldValue" ADD CONSTRAINT "CartProductFieldValue_fieldOptionAssetId_fkey" FOREIGN KEY ("fieldOptionAssetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Currency" ADD CONSTRAINT "Currency_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyAmount" ADD CONSTRAINT "MoneyAmount_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "Currency"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingOption" ADD CONSTRAINT "ShippingOption_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingOption" ADD CONSTRAINT "ShippingOption_instructionsTranslationId_fkey" FOREIGN KEY ("instructionsTranslationId") REFERENCES "Translation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingOption" ADD CONSTRAINT "ShippingOption_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "MoneyAmount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingOption" ADD CONSTRAINT "ShippingOption_shippingProviderId_fkey" FOREIGN KEY ("shippingProviderId") REFERENCES "ShippingProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingProvider" ADD CONSTRAINT "ShippingProvider_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentOption" ADD CONSTRAINT "PaymentOption_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentOption" ADD CONSTRAINT "PaymentOption_instructionsTranslationId_fkey" FOREIGN KEY ("instructionsTranslationId") REFERENCES "Translation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentOption" ADD CONSTRAINT "PaymentOption_paymentProviderId_fkey" FOREIGN KEY ("paymentProviderId") REFERENCES "PaymentProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentProvider" ADD CONSTRAINT "PaymentProvider_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssetToProduct" ADD CONSTRAINT "_AssetToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssetToProduct" ADD CONSTRAINT "_AssetToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToProductCollection" ADD CONSTRAINT "_ProductToProductCollection_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToProductCollection" ADD CONSTRAINT "_ProductToProductCollection_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductFieldOptionToProductVariant" ADD CONSTRAINT "_ProductFieldOptionToProductVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "ProductFieldOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductFieldOptionToProductVariant" ADD CONSTRAINT "_ProductFieldOptionToProductVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoneyAmountToProductField" ADD CONSTRAINT "_MoneyAmountToProductField_A_fkey" FOREIGN KEY ("A") REFERENCES "MoneyAmount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoneyAmountToProductField" ADD CONSTRAINT "_MoneyAmountToProductField_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoneyAmountToProductVariant" ADD CONSTRAINT "_MoneyAmountToProductVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "MoneyAmount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoneyAmountToProductVariant" ADD CONSTRAINT "_MoneyAmountToProductVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoneyAmountToProductFieldOption" ADD CONSTRAINT "_MoneyAmountToProductFieldOption_A_fkey" FOREIGN KEY ("A") REFERENCES "MoneyAmount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoneyAmountToProductFieldOption" ADD CONSTRAINT "_MoneyAmountToProductFieldOption_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductFieldOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoneyAmountToProduct" ADD CONSTRAINT "_MoneyAmountToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "MoneyAmount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoneyAmountToProduct" ADD CONSTRAINT "_MoneyAmountToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
