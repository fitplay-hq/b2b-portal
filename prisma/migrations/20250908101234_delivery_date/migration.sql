/*
  Warnings:

  - Added the required column `requiredByDate` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "requiredByDate" TIMESTAMP(3) NOT NULL;
