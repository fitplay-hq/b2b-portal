/*
  Warnings:

  - You are about to drop the column `brandId` on the `OMProduct` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OMProduct" DROP CONSTRAINT "OMProduct_brandId_fkey";

-- AlterTable
ALTER TABLE "OMBrand" ADD COLUMN     "oMProductId" TEXT;

-- AlterTable
ALTER TABLE "OMProduct" DROP COLUMN "brandId";

-- CreateTable
CREATE TABLE "_OMProductBrands" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OMProductBrands_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OMProductBrands_B_index" ON "_OMProductBrands"("B");

-- AddForeignKey
ALTER TABLE "OMBrand" ADD CONSTRAINT "OMBrand_oMProductId_fkey" FOREIGN KEY ("oMProductId") REFERENCES "OMProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OMProductBrands" ADD CONSTRAINT "_OMProductBrands_A_fkey" FOREIGN KEY ("A") REFERENCES "OMBrand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OMProductBrands" ADD CONSTRAINT "_OMProductBrands_B_fkey" FOREIGN KEY ("B") REFERENCES "OMProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
