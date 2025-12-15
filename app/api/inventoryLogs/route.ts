import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { hasPermission, RESOURCES, PERMISSIONS } from "@/lib/utils";

/**
 * GET /api/admin/inventory-logs
 * Fetch inventory log history with filters: product, reason, date ranges etc.
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(auth);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Permission check
        if (session.user.role !== "ADMIN") {
            const userPermissions = session.user.permissions || [];
            if (!hasPermission(userPermissions, RESOURCES.INVENTORY, PERMISSIONS.READ)) {
                return NextResponse.json(
                    { error: "Insufficient permissions" },
                    { status: 403 }
                );
            }
        }

        const { searchParams } = new URL(request.url);

        const productId = searchParams.get("productId");
        const reason = searchParams.get("reason");
        const search = searchParams.get("search");

        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");
        const period = searchParams.get("period") || "30d"; // default 30 days

        // === DATE FILTERS ===
        const dateFilter: { gte?: Date; lte?: Date } = {};
        if (dateFrom) dateFilter.gte = new Date(dateFrom);
        if (dateTo) dateFilter.lte = new Date(dateTo);

        if (!dateFrom && !dateTo) {
            const now = new Date();
            const days =
                period === "7d" ? 7 : period === "90d" ? 90 : 30;
            dateFilter.gte = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        }

        // Fetch product(s)
        const products = await prisma.product.findMany({
            where: productId ? { id: productId } : {},
            select: {
                id: true,
                name: true,
                sku: true,
                inventoryLogs: true
            }
        });

        const parsedLogs: any[] = [];

        for (const product of products) {
            for (const logEntry of product.inventoryLogs) {
                // Example:
                // "2025-12-08T08:24:14.861Z | Removed 3 units | Reason: PHYSICAL_STOCK_CHECK"
                // console.log("Log Entry:", logEntry);

                const [timestampRaw, actionRaw, reasonRaw] = logEntry.split(" | ");
                // console.log("Parsed Log Entry:", { timestampRaw, actionRaw, reasonRaw });

                const timestamp = new Date(timestampRaw);

                const actionText = actionRaw; // "Removed 3 units"
                const parsedQuantity = parseInt(actionText.match(/\d+/)?.[0] || "0");
                const isAddition = actionText.toLowerCase().includes("added");
                const isRemoval = actionText.toLowerCase().includes("removed");

                const quantity = isAddition ? parsedQuantity : isRemoval ? -parsedQuantity : 0;

                const extractedReason = reasonRaw?.replace("Reason: ", "").trim() || null;

                // === Apply Filters ===
                if (dateFilter.gte && timestamp < dateFilter.gte) continue;
                if (dateFilter.lte && timestamp > dateFilter.lte) continue;

                if (reason && extractedReason !== reason) continue;

                if (search && !logEntry.toLowerCase().includes(search.toLowerCase())) continue;

                parsedLogs.push({
                    productId: product.id,
                    productName: product.name,
                    sku: product.sku,
                    raw: logEntry,
                    timestamp,
                    action: actionText,
                    reason: extractedReason,
                    quantity, // +3 or -3
                });
            }
        }

        // Sort newest → oldest
        parsedLogs.sort((a, b) => b.timestamp - a.timestamp);

        return NextResponse.json({
            count: parsedLogs.length,
            logs: parsedLogs,
            filtersUsed: {
                productId,
                reason,
                search,
                dateFrom: dateFilter.gte,
                dateTo: dateFilter.lte,
            },
        });

    } catch (error) {
        console.error("Inventory Logs API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch inventory logs" },
            { status: 500 }
        );
    }
}
