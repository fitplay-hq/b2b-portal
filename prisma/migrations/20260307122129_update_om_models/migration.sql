/*
  Warnings:

  - You are about to drop the column `category` on the `OMProduct` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OMDispatchOrder" DROP CONSTRAINT "OMDispatchOrder_logisticsPartnerId_fkey";

-- DropForeignKey
ALTER TABLE "OMPurchaseOrder" DROP CONSTRAINT "OMPurchaseOrder_locationId_fkey";

-- AlterTable
ALTER TABLE "OMDispatchOrder" ALTER COLUMN "invoiceNumber" DROP NOT NULL,
ALTER COLUMN "invoiceDate" DROP NOT NULL,
ALTER COLUMN "logisticsPartnerId" DROP NOT NULL,
ALTER COLUMN "docketNumber" DROP NOT NULL,
ALTER COLUMN "expectedDeliveryDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OMProduct" DROP COLUMN "category",
ADD COLUMN     "brand" VARCHAR(100),
ALTER COLUMN "defaultGstPct" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "OMPurchaseOrder" ALTER COLUMN "locationId" DROP NOT NULL,
ALTER COLUMN "estimateNumber" DROP NOT NULL,
ALTER COLUMN "estimateDate" DROP NOT NULL,
ALTER COLUMN "poNumber" DROP NOT NULL,
ALTER COLUMN "poDate" DROP NOT NULL,
ALTER COLUMN "poReceivedDate" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AddForeignKey
ALTER TABLE "OMPurchaseOrder" ADD CONSTRAINT "OMPurchaseOrder_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "OMDeliveryLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OMDispatchOrder" ADD CONSTRAINT "OMDispatchOrder_logisticsPartnerId_fkey" FOREIGN KEY ("logisticsPartnerId") REFERENCES "OMLogisticsPartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
