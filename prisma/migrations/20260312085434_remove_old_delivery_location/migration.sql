/*
  Warnings:

  - You are about to drop the column `locationId` on the `OMPurchaseOrder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OMPurchaseOrder" DROP CONSTRAINT "OMPurchaseOrder_locationId_fkey";

-- AlterTable
ALTER TABLE "OMPurchaseOrder" DROP COLUMN "locationId";
