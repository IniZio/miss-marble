-- AlterTable
ALTER TABLE "ProductField" ADD COLUMN     "isReserved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ProductFieldToProduct" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0;
