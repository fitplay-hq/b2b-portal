/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `OMDeliveryLocation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `OMLogisticsPartner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OMDeliveryLocation_name_key" ON "OMDeliveryLocation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "OMLogisticsPartner_name_key" ON "OMLogisticsPartner"("name");
