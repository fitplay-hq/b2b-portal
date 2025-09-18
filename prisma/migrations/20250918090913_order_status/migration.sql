/*
  Warnings:

  - The values [HR,EMPLOYEE] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Role_new" AS ENUM ('ADMIN', 'CLIENT');
ALTER TABLE "public"."Admin" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."Client" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."User" ALTER COLUMN "role" TYPE "public"."Role_new" USING ("role"::text::"public"."Role_new");
ALTER TABLE "public"."Admin" ALTER COLUMN "role" TYPE "public"."Role_new" USING ("role"::text::"public"."Role_new");
ALTER TABLE "public"."Client" ALTER COLUMN "role" TYPE "public"."Role_new" USING ("role"::text::"public"."Role_new");
ALTER TYPE "public"."Role" RENAME TO "Role_old";
ALTER TYPE "public"."Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "public"."Admin" ALTER COLUMN "role" SET DEFAULT 'ADMIN';
ALTER TABLE "public"."Client" ALTER COLUMN "role" SET DEFAULT 'CLIENT';
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."Status" ADD VALUE 'READY_FOR_DISPATCH';
ALTER TYPE "public"."Status" ADD VALUE 'DISPATCHED';
ALTER TYPE "public"."Status" ADD VALUE 'AT_DESTINATION';
ALTER TYPE "public"."Status" ADD VALUE 'DELIVERED';
