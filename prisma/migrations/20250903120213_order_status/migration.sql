-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'PENDING';
