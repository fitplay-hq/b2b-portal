-- CreateEnum
CREATE TYPE "public"."Reason" AS ENUM ('NEW_PURCHASE', 'PHYSICAL_STOCK_CHECK', 'RETURN_FROM_PREVIOUS_DISPATCH');

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "inventoryUpdateReason" "public"."Reason";
