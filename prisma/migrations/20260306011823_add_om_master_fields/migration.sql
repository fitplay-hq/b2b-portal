-- CreateEnum
CREATE TYPE "OMPoStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'PARTIALLY_DISPATCHED', 'FULLY_DISPATCHED', 'CLOSED');

-- CreateEnum
CREATE TYPE "OMDispatchStatus" AS ENUM ('CREATED', 'DISPATCHED', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "OMClient" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OMClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OMDeliveryLocation" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OMDeliveryLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OMPurchaseOrder" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "estimateNumber" TEXT NOT NULL,
    "estimateDate" TIMESTAMP(3) NOT NULL,
    "poNumber" TEXT NOT NULL,
    "poDate" TIMESTAMP(3) NOT NULL,
    "poReceivedDate" TIMESTAMP(3) NOT NULL,
    "status" "OMPoStatus" NOT NULL DEFAULT 'CONFIRMED',
    "totalGst" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "grandTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OMPurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OMProduct" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "sku" VARCHAR(100),
    "description" VARCHAR(255),
    "price" DOUBLE PRECISION,
    "defaultGstPct" DOUBLE PRECISION NOT NULL DEFAULT 18,
    "category" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OMProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OMPurchaseOrderItem" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "gstPercentage" DOUBLE PRECISION NOT NULL,
    "gstAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OMPurchaseOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OMLogisticsPartner" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OMLogisticsPartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OMDispatchOrder" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "logisticsPartnerId" TEXT NOT NULL,
    "docketNumber" TEXT NOT NULL,
    "expectedDeliveryDate" TIMESTAMP(3) NOT NULL,
    "status" "OMDispatchStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OMDispatchOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OMDispatchOrderItem" (
    "id" TEXT NOT NULL,
    "dispatchOrderId" TEXT NOT NULL,
    "purchaseOrderItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "gstPercentage" DOUBLE PRECISION NOT NULL,
    "gstAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OMDispatchOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OMPurchaseOrder_estimateNumber_key" ON "OMPurchaseOrder"("estimateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "OMPurchaseOrder_poNumber_key" ON "OMPurchaseOrder"("poNumber");

-- CreateIndex
CREATE UNIQUE INDEX "OMProduct_sku_key" ON "OMProduct"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "OMDispatchOrder_invoiceNumber_key" ON "OMDispatchOrder"("invoiceNumber");

-- AddForeignKey
ALTER TABLE "OMPurchaseOrder" ADD CONSTRAINT "OMPurchaseOrder_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "OMClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OMPurchaseOrder" ADD CONSTRAINT "OMPurchaseOrder_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "OMDeliveryLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OMPurchaseOrderItem" ADD CONSTRAINT "OMPurchaseOrderItem_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "OMPurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OMPurchaseOrderItem" ADD CONSTRAINT "OMPurchaseOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "OMProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OMDispatchOrder" ADD CONSTRAINT "OMDispatchOrder_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "OMPurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OMDispatchOrder" ADD CONSTRAINT "OMDispatchOrder_logisticsPartnerId_fkey" FOREIGN KEY ("logisticsPartnerId") REFERENCES "OMLogisticsPartner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OMDispatchOrderItem" ADD CONSTRAINT "OMDispatchOrderItem_dispatchOrderId_fkey" FOREIGN KEY ("dispatchOrderId") REFERENCES "OMDispatchOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OMDispatchOrderItem" ADD CONSTRAINT "OMDispatchOrderItem_purchaseOrderItemId_fkey" FOREIGN KEY ("purchaseOrderItemId") REFERENCES "OMPurchaseOrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
