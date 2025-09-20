-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "consignmentNumber" TEXT,
ADD COLUMN     "deliveryService" TEXT,
ADD COLUMN     "isMailSent" BOOLEAN NOT NULL DEFAULT false;
