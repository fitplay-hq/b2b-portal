/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_companyId_fkey";

-- AlterTable
ALTER TABLE "public"."Client" ADD COLUMN     "companyID" TEXT,
ALTER COLUMN "companyName" DROP NOT NULL,
ALTER COLUMN "companyName" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "public"."User";

-- DropTable
DROP TABLE "public"."VerificationToken";

-- AddForeignKey
ALTER TABLE "public"."Client" ADD CONSTRAINT "Client_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
