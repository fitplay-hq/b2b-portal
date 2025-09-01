/*
  Warnings:

  - Added the required column `role` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "public"."Admin" ADD COLUMN     "role" "public"."Role" NOT NULL;
