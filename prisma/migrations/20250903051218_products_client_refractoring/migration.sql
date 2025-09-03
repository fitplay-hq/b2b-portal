/*
  Warnings:

  - The values [FITNESS,SUPPLEMENTS,WEARABLES,RECOVERY] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `specification` on the `Product` table. All the data in the column will be lost.
  - Added the required column `companyName` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Category_new" AS ENUM ('stationery', 'accessories', 'funAndStickers', 'drinkware', 'apparel', 'travelAndTech', 'books', 'welcomeKit');
ALTER TABLE "public"."Product" ALTER COLUMN "categories" TYPE "public"."Category_new" USING ("categories"::text::"public"."Category_new");
ALTER TYPE "public"."Category" RENAME TO "Category_old";
ALTER TYPE "public"."Category_new" RENAME TO "Category";
DROP TYPE "public"."Category_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Client" ADD COLUMN     "companyName" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "specification";
