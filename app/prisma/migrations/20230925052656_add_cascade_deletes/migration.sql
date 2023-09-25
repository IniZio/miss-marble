-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_billingAddresssId_fkey";

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_currencyCode_fkey";

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_shippingAddresssId_fkey";

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_shippingOptionId_fkey";

-- DropForeignKey
ALTER TABLE "CartProductFieldValue" DROP CONSTRAINT "CartProductFieldValue_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "CartProductFieldValue" DROP CONSTRAINT "CartProductFieldValue_fieldOptionAssetId_fkey";

-- DropForeignKey
ALTER TABLE "CartProductFieldValue" DROP CONSTRAINT "CartProductFieldValue_fieldOptionId_fkey";

-- DropForeignKey
ALTER TABLE "CartProductFieldValue" DROP CONSTRAINT "CartProductFieldValue_lineItemId_fkey";

-- DropForeignKey
ALTER TABLE "Currency" DROP CONSTRAINT "Currency_nameTranslationId_fkey";

-- DropForeignKey
ALTER TABLE "LineItem" DROP CONSTRAINT "LineItem_cartId_fkey";

-- DropForeignKey
ALTER TABLE "LineItem" DROP CONSTRAINT "LineItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "LineItem" DROP CONSTRAINT "LineItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "LineItem" DROP CONSTRAINT "LineItem_productVariantId_fkey";

-- DropForeignKey
ALTER TABLE "MoneyAmount" DROP CONSTRAINT "MoneyAmount_currencyCode_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_billingAddresssId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_cartId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_currencyCode_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_shippingAddresssId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_shippingOptionId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentOption" DROP CONSTRAINT "PaymentOption_instructionsTranslationId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentOption" DROP CONSTRAINT "PaymentOption_nameTranslationId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentOption" DROP CONSTRAINT "PaymentOption_paymentProviderId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentProvider" DROP CONSTRAINT "PaymentProvider_nameTranslationId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_nameTranslationId_fkey";

-- DropForeignKey
ALTER TABLE "ProductCollection" DROP CONSTRAINT "ProductCollection_nameTranslationId_fkey";

-- DropForeignKey
ALTER TABLE "ProductField" DROP CONSTRAINT "ProductField_nameTranslationId_fkey";

-- DropForeignKey
ALTER TABLE "ProductFieldOption" DROP CONSTRAINT "ProductFieldOption_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "ProductFieldOption" DROP CONSTRAINT "ProductFieldOption_nameTranslationId_fkey";

-- DropForeignKey
ALTER TABLE "ProductFieldToProduct" DROP CONSTRAINT "ProductFieldToProduct_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "ProductFieldToProduct" DROP CONSTRAINT "ProductFieldToProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariantFieldValue" DROP CONSTRAINT "ProductVariantFieldValue_fieldOptionId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariantFieldValue" DROP CONSTRAINT "ProductVariantFieldValue_variantId_fkey";

-- DropForeignKey
ALTER TABLE "ShippingOption" DROP CONSTRAINT "ShippingOption_instructionsTranslationId_fkey";

-- DropForeignKey
ALTER TABLE "ShippingOption" DROP CONSTRAINT "ShippingOption_nameTranslationId_fkey";

-- DropForeignKey
ALTER TABLE "ShippingOption" DROP CONSTRAINT "ShippingOption_priceId_fkey";

-- DropForeignKey
ALTER TABLE "ShippingOption" DROP CONSTRAINT "ShippingOption_shippingProviderId_fkey";

-- DropForeignKey
ALTER TABLE "ShippingProvider" DROP CONSTRAINT "ShippingProvider_nameTranslationId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "externalData" TEXT;

-- CreateIndex
CREATE INDEX "externalData" ON "Order"("externalData");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductField" ADD CONSTRAINT "ProductField_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFieldToProduct" ADD CONSTRAINT "ProductFieldToProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFieldToProduct" ADD CONSTRAINT "ProductFieldToProduct_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "ProductField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFieldOption" ADD CONSTRAINT "ProductFieldOption_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFieldOption" ADD CONSTRAINT "ProductFieldOption_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "ProductField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariantFieldValue" ADD CONSTRAINT "ProductVariantFieldValue_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariantFieldValue" ADD CONSTRAINT "ProductVariantFieldValue_fieldOptionId_fkey" FOREIGN KEY ("fieldOptionId") REFERENCES "ProductFieldOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCollection" ADD CONSTRAINT "ProductCollection_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_billingAddresssId_fkey" FOREIGN KEY ("billingAddresssId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_shippingAddresssId_fkey" FOREIGN KEY ("shippingAddresssId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "Currency"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_shippingOptionId_fkey" FOREIGN KEY ("shippingOptionId") REFERENCES "ShippingOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProductFieldValue" ADD CONSTRAINT "CartProductFieldValue_lineItemId_fkey" FOREIGN KEY ("lineItemId") REFERENCES "LineItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProductFieldValue" ADD CONSTRAINT "CartProductFieldValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "ProductField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProductFieldValue" ADD CONSTRAINT "CartProductFieldValue_fieldOptionId_fkey" FOREIGN KEY ("fieldOptionId") REFERENCES "ProductFieldOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProductFieldValue" ADD CONSTRAINT "CartProductFieldValue_fieldOptionAssetId_fkey" FOREIGN KEY ("fieldOptionAssetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Currency" ADD CONSTRAINT "Currency_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyAmount" ADD CONSTRAINT "MoneyAmount_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "Currency"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingOption" ADD CONSTRAINT "ShippingOption_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingOption" ADD CONSTRAINT "ShippingOption_instructionsTranslationId_fkey" FOREIGN KEY ("instructionsTranslationId") REFERENCES "Translation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingOption" ADD CONSTRAINT "ShippingOption_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "MoneyAmount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingOption" ADD CONSTRAINT "ShippingOption_shippingProviderId_fkey" FOREIGN KEY ("shippingProviderId") REFERENCES "ShippingProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingProvider" ADD CONSTRAINT "ShippingProvider_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentOption" ADD CONSTRAINT "PaymentOption_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentOption" ADD CONSTRAINT "PaymentOption_instructionsTranslationId_fkey" FOREIGN KEY ("instructionsTranslationId") REFERENCES "Translation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentOption" ADD CONSTRAINT "PaymentOption_paymentProviderId_fkey" FOREIGN KEY ("paymentProviderId") REFERENCES "PaymentProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentProvider" ADD CONSTRAINT "PaymentProvider_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_billingAddresssId_fkey" FOREIGN KEY ("billingAddresssId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingAddresssId_fkey" FOREIGN KEY ("shippingAddresssId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "Currency"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingOptionId_fkey" FOREIGN KEY ("shippingOptionId") REFERENCES "ShippingOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
