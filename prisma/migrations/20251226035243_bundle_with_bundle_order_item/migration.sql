-- AddForeignKey
ALTER TABLE "BundleOrderItem" ADD CONSTRAINT "BundleOrderItem_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
