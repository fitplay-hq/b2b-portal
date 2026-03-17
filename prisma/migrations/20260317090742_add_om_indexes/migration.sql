-- CreateIndex
CREATE INDEX "OMDispatchOrder_invoiceNumber_idx" ON "OMDispatchOrder"("invoiceNumber");

-- CreateIndex
CREATE INDEX "OMPurchaseOrder_clientId_idx" ON "OMPurchaseOrder"("clientId");

-- CreateIndex
CREATE INDEX "OMPurchaseOrder_poNumber_idx" ON "OMPurchaseOrder"("poNumber");
