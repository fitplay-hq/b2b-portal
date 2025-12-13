/*
  Warnings:

  - Added the required column `password` to the `ResetToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ResetToken" ADD COLUMN     "password" TEXT NOT NULL;
