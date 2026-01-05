/*
  Warnings:

  - You are about to drop the column `numberOfBundles` on the `BundleItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bundle" ADD COLUMN     "numberOfBundles" INTEGER;

-- AlterTable
ALTER TABLE "BundleItem" DROP COLUMN "numberOfBundles";
