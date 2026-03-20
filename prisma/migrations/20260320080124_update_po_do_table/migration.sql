-- AlterTable
ALTER TABLE "OMDispatchOrder" ADD COLUMN     "totalQuantity" INTEGER;

-- AlterTable
ALTER TABLE "OMPurchaseOrder" ADD COLUMN     "dispatchedQuantity" INTEGER,
ADD COLUMN     "remainingQuantity" INTEGER,
ADD COLUMN     "totalQuantity" INTEGER;

-- AlterTable
ALTER TABLE "OMPurchaseOrderItem" ADD COLUMN     "dispatchedQuantity" INTEGER DEFAULT 0,
ADD COLUMN     "remainingQuantity" INTEGER,
ALTER COLUMN "quantity" DROP NOT NULL;
