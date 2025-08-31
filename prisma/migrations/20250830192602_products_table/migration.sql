/*
  Warnings:

  - You are about to alter the column `name` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `address` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(16)`.

*/
-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('FITNESS', 'SUPPLEMENTS', 'WEARABLES', 'RECOVERY');

-- AlterTable
ALTER TABLE "public"."Company" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "name" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(16);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "images" TEXT[],
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "specification" JSONB NOT NULL,
    "categories" "public"."Category" NOT NULL,
    "avgRating" DOUBLE PRECISION NOT NULL,
    "noOfReviews" INTEGER NOT NULL,
    "brand" VARCHAR(30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_CompanyToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CompanyToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CompanyToProduct_B_index" ON "public"."_CompanyToProduct"("B");

-- AddForeignKey
ALTER TABLE "public"."_CompanyToProduct" ADD CONSTRAINT "_CompanyToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CompanyToProduct" ADD CONSTRAINT "_CompanyToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
