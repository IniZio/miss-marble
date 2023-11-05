-- AlterTable
ALTER TABLE "InventoryLevel" ADD COLUMN     "isBelowSafeQuantity" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "safeQuantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unit" TEXT,
ALTER COLUMN "quantity" SET DEFAULT 0;
