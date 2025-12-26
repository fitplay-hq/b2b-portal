/*
  Warnings:

  - You are about to drop the column `bundleId` on the `BundleItem` table. All the data in the column will be lost.
  - You are about to drop the `Bundle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderBundle` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `orderId` to the `BundleItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `BundleItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BundleItem" DROP CONSTRAINT "BundleItem_bundleId_fkey";

-- DropForeignKey
ALTER TABLE "OrderBundle" DROP CONSTRAINT "OrderBundle_bundleId_fkey";

-- DropForeignKey
ALTER TABLE "OrderBundle" DROP CONSTRAINT "OrderBundle_orderId_fkey";

-- AlterTable
ALTER TABLE "BundleItem" DROP COLUMN "bundleId",
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 1;

-- DropTable
DROP TABLE "Bundle";

-- DropTable
DROP TABLE "OrderBundle";

-- AddForeignKey
ALTER TABLE "BundleItem" ADD CONSTRAINT "BundleItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
