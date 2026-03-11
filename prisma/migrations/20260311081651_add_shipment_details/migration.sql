-- CreateTable
CREATE TABLE "OMShipmentBox" (
    "id" TEXT NOT NULL,
    "dispatchOrderId" TEXT NOT NULL,
    "boxLabel" TEXT,
    "length" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "numberOfBoxes" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OMShipmentBox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OMShipmentBoxContent" (
    "id" TEXT NOT NULL,
    "shipmentBoxId" TEXT NOT NULL,
    "dispatchOrderItemId" TEXT NOT NULL,
    "quantityPerBox" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OMShipmentBoxContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OMShipmentBox_dispatchOrderId_idx" ON "OMShipmentBox"("dispatchOrderId");

-- CreateIndex
CREATE INDEX "OMShipmentBoxContent_shipmentBoxId_idx" ON "OMShipmentBoxContent"("shipmentBoxId");

-- CreateIndex
CREATE INDEX "OMShipmentBoxContent_dispatchOrderItemId_idx" ON "OMShipmentBoxContent"("dispatchOrderItemId");

-- AddForeignKey
ALTER TABLE "OMShipmentBox" ADD CONSTRAINT "OMShipmentBox_dispatchOrderId_fkey" FOREIGN KEY ("dispatchOrderId") REFERENCES "OMDispatchOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OMShipmentBoxContent" ADD CONSTRAINT "OMShipmentBoxContent_shipmentBoxId_fkey" FOREIGN KEY ("shipmentBoxId") REFERENCES "OMShipmentBox"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OMShipmentBoxContent" ADD CONSTRAINT "OMShipmentBoxContent_dispatchOrderItemId_fkey" FOREIGN KEY ("dispatchOrderItemId") REFERENCES "OMDispatchOrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
