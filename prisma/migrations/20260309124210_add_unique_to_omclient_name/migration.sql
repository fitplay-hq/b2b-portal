/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `OMClient` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OMClient_name_key" ON "OMClient"("name");
