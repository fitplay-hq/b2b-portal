-- AlterTable
ALTER TABLE "OMDispatchOrder" ADD COLUMN     "deliveryLocationId" TEXT;

-- CreateTable
CREATE TABLE "_PurchaseOrderLocations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PurchaseOrderLocations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PurchaseOrderLocations_B_index" ON "_PurchaseOrderLocations"("B");

-- AddForeignKey
ALTER TABLE "OMDispatchOrder" ADD CONSTRAINT "OMDispatchOrder_deliveryLocationId_fkey" FOREIGN KEY ("deliveryLocationId") REFERENCES "OMDeliveryLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PurchaseOrderLocations" ADD CONSTRAINT "_PurchaseOrderLocations_A_fkey" FOREIGN KEY ("A") REFERENCES "OMDeliveryLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PurchaseOrderLocations" ADD CONSTRAINT "_PurchaseOrderLocations_B_fkey" FOREIGN KEY ("B") REFERENCES "OMPurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Custom SQL to migrate existing data
INSERT INTO "_PurchaseOrderLocations" ("A", "B")
SELECT "locationId", "id" FROM "OMPurchaseOrder" WHERE "locationId" IS NOT NULL;
