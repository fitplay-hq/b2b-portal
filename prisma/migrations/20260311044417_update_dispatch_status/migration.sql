/*
  Warnings:

  - The values [CREATED] on the enum `OMDispatchStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OMDispatchStatus_new" AS ENUM ('PENDING', 'APPROVED', 'READY_FOR_DISPATCH', 'DISPATCHED', 'AT_DESTINATION', 'DELIVERED', 'CANCELLED');
ALTER TABLE "public"."OMDispatchOrder" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "OMDispatchOrder" ALTER COLUMN "status" TYPE "OMDispatchStatus_new" USING ("status"::text::"OMDispatchStatus_new");
ALTER TYPE "OMDispatchStatus" RENAME TO "OMDispatchStatus_old";
ALTER TYPE "OMDispatchStatus_new" RENAME TO "OMDispatchStatus";
DROP TYPE "public"."OMDispatchStatus_old";
ALTER TABLE "OMDispatchOrder" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "OMDispatchOrder" ALTER COLUMN "status" SET DEFAULT 'PENDING';
