-- CreateEnum
CREATE TYPE "public"."Modes" AS ENUM ('AIR', 'SURFACE');

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_clientId_fkey";

-- AlterTable
ALTER TABLE "public"."Admin" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "city" TEXT NOT NULL DEFAULT 'City',
ADD COLUMN     "consigneeEmail" TEXT NOT NULL DEFAULT 'email@example.com',
ADD COLUMN     "consigneeName" TEXT NOT NULL DEFAULT 'Name',
ADD COLUMN     "consigneePhone" TEXT NOT NULL DEFAULT '0000000000',
ADD COLUMN     "modeOfDelivery" "public"."Modes" NOT NULL DEFAULT 'SURFACE',
ADD COLUMN     "pincode" TEXT NOT NULL DEFAULT '000000',
ADD COLUMN     "state" TEXT NOT NULL DEFAULT 'State',
ALTER COLUMN "clientId" DROP NOT NULL,
ALTER COLUMN "deliveryAddress" SET DEFAULT 'Address';

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
