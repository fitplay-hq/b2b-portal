-- AlterEnum
ALTER TYPE "public"."Category" ADD VALUE 'newcategory';

-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "categories" DROP NOT NULL;
