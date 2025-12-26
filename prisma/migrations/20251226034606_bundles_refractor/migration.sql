/*
  Warnings:

  - You are about to drop the column `orderId` on the `BundleItem` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `BundleItem` table. All the data in the column will be lost.
  - Added the required column `bundleId` to the `BundleItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `BundleItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BundleItem" DROP CONSTRAINT "BundleItem_orderId_fkey";

-- AlterTable
ALTER TABLE "BundleItem" DROP COLUMN "orderId",
DROP COLUMN "quantity",
ADD COLUMN     "bundleId" TEXT NOT NULL,
ADD COLUMN     "bundleProductQuantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "numberOfBundles" INTEGER;

-- CreateTable
CREATE TABLE "BundleOrderItem" (
    "id" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BundleOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bundle" (
    "id" TEXT NOT NULL,
    "orderId" TEXT,
    "price" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BundleItemToBundleOrderItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BundleItemToBundleOrderItem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BundleItemToBundleOrderItem_B_index" ON "_BundleItemToBundleOrderItem"("B");

-- AddForeignKey
ALTER TABLE "BundleOrderItem" ADD CONSTRAINT "BundleOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleOrderItem" ADD CONSTRAINT "BundleOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleItem" ADD CONSTRAINT "BundleItem_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bundle" ADD CONSTRAINT "Bundle_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BundleItemToBundleOrderItem" ADD CONSTRAINT "_BundleItemToBundleOrderItem_A_fkey" FOREIGN KEY ("A") REFERENCES "BundleItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BundleItemToBundleOrderItem" ADD CONSTRAINT "_BundleItemToBundleOrderItem_B_fkey" FOREIGN KEY ("B") REFERENCES "BundleOrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
