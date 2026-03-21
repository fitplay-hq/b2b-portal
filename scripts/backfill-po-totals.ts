import prisma from "../lib/prisma";
import { syncOMPurchaseOrderTotals } from "../lib/om-data";

async function backfillPOTotals() {
  console.log("🚀 Starting backfill of Purchase Order totals...");

  try {
    const pos = await prisma.oMPurchaseOrder.findMany({
      select: { id: true, poNumber: true }
    });

    console.log(`Found ${pos.length} Purchase Orders to sync.`);

    for (let i = 0; i < pos.length; i++) {
      const po = pos[i];
      process.stdout.write(`[${i + 1}/${pos.length}] Syncing PO ${po.poNumber || po.id}... `);
      try {
        await syncOMPurchaseOrderTotals(po.id);
        console.log("✅");
      } catch (e) {
        console.log("❌");
        console.error(`Error syncing PO ${po.id}:`, e);
      }
    }

    console.log("\n🎉 Backfill process finished!");
  } catch (error) {
    console.error("❌ Fatal error during backfill:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

backfillPOTotals();
