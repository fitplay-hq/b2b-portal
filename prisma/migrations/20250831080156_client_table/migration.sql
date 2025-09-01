/*
  Warnings:

  - You are about to alter the column `password` on the `Admin` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(16)`.
  - A unique constraint covering the columns `[sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `availableStock` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Admin" ALTER COLUMN "password" SET DATA TYPE VARCHAR(16);

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "availableStock" INTEGER NOT NULL,
ADD COLUMN     "sku" VARCHAR(100) NOT NULL;

-- CreateTable
CREATE TABLE "public"."Client" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(16) NOT NULL,
    "phone" TEXT NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "public"."Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_phone_key" ON "public"."Client"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "public"."Product"("sku");
