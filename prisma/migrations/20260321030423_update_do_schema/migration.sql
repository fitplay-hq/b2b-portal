-- CreateEnum
CREATE TYPE "OMDispatchType" AS ENUM ('ORDER', 'SAMPLE');

-- DropForeignKey
ALTER TABLE "OMDispatchOrder" DROP CONSTRAINT "OMDispatchOrder_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "OMDispatchOrderItem" DROP CONSTRAINT "OMDispatchOrderItem_purchaseOrderItemId_fkey";

-- AlterTable
ALTER TABLE "OMDispatchOrder" ADD COLUMN     "dispatchType" "OMDispatchType" NOT NULL DEFAULT 'ORDER',
ALTER COLUMN "purchaseOrderId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OMDispatchOrderItem" ADD COLUMN     "brandName" TEXT,
ADD COLUMN     "itemName" TEXT,
ADD COLUMN     "productId" TEXT,
ALTER COLUMN "purchaseOrderItemId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "OMDispatchOrder_dispatchType_idx" ON "OMDispatchOrder"("dispatchType");

-- AddForeignKey
ALTER TABLE "OMDispatchOrder" ADD CONSTRAINT "OMDispatchOrder_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "OMPurchaseOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OMDispatchOrderItem" ADD CONSTRAINT "OMDispatchOrderItem_purchaseOrderItemId_fkey" FOREIGN KEY ("purchaseOrderItemId") REFERENCES "OMPurchaseOrderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OMDispatchOrderItem" ADD CONSTRAINT "OMDispatchOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "OMProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
