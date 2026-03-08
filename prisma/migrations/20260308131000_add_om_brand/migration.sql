-- CreateTable
CREATE TABLE "OMBrand" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OMBrand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductBrands" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductBrands_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "OMBrand_name_key" ON "OMBrand"("name");

-- CreateIndex
CREATE INDEX "_ProductBrands_B_index" ON "_ProductBrands"("B");

-- AlterTable
ALTER TABLE "OMPurchaseOrderItem" ADD COLUMN "brandId" TEXT;

-- AddForeignKey
ALTER TABLE "OMPurchaseOrderItem" ADD CONSTRAINT "OMPurchaseOrderItem_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "OMBrand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductBrands" ADD CONSTRAINT "_ProductBrands_A_fkey" FOREIGN KEY ("A") REFERENCES "OMBrand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductBrands" ADD CONSTRAINT "_ProductBrands_B_fkey" FOREIGN KEY ("B") REFERENCES "OMProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
