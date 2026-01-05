import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { hasPermission, RESOURCES, PERMISSIONS } from "@/lib/utils";

/**
 * GET /api/inventoryLogs
 * Fetch inventory logs with computed final stock (newest → oldest)
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(auth);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Permission check: Admins can see everything, clients can see their own products
        if (session.user.role !== "ADMIN") {
            // For non-admin users, they should be able to see inventory logs for products
            // associated with their company - this is basic operational data
            // Only block if they specifically lack inventory permissions AND are not a client
            if (session.user.role !== "CLIENT") {
                const perms = session.user.permissions || [];
                if (!hasPermission(perms, RESOURCES.INVENTORY, PERMISSIONS.READ)) {
                    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
                }
            }
        }

        const { searchParams } = new URL(request.url);

        const productId = searchParams.get("productId");
        const reasonFilter = searchParams.get("reason");
        const search = searchParams.get("search");
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");
        const period = searchParams.get("period") || "30d";

        /* ---------------- DATE FILTER ---------------- */
        const dateFilter: { gte?: Date; lte?: Date } = {};
        if (dateFrom) dateFilter.gte = new Date(dateFrom);
        if (dateTo) dateFilter.lte = new Date(dateTo);

        if (!dateFrom && !dateTo) {
            const now = new Date();
            const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
            dateFilter.gte = new Date(now.getTime() - days * 86400000);
        }

        /* ---------------- FETCH PRODUCTS ---------------- */
        // Build product filter
        const productWhere: any = {};
        if (productId) {
            productWhere.id = productId;
        }

        // For clients, only show products associated with their company
        if (session.user.role === "CLIENT") {
            const client = await prisma.client.findUnique({
                where: { id: session.user.id },
                select: { companyID: true },
            });
            if (client?.companyID) {
                productWhere.companies = { some: { id: client.companyID } };
            }
        }

        const products = await prisma.product.findMany({
            where: productWhere,
            select: {
                id: true,
                name: true,
                sku: true,
                availableStock: true,
                minStockThreshold: true,
                inventoryLogs: true
            }
        });

        const finalLogs: any[] = [];

        /* ---------------- PROCESS EACH PRODUCT ---------------- */
        for (const product of products) {
            const productLogs: any[] = [];

            /* Parse logs */
            for (const entry of product.inventoryLogs) {
                const parts = entry.split(" | ");
                if (parts.length < 3) continue;

                const timestamp = new Date(parts[0]);
                if (dateFilter.gte && timestamp < dateFilter.gte) continue;
                if (dateFilter.lte && timestamp > dateFilter.lte) continue;

                const actionText = parts[1];
                const reasonText = parts.find(p => p.startsWith("Reason:"));
                const stockText = parts.find(p => p.startsWith("Updated stock:"));
                const remarksText = parts.find(p => p.startsWith("Remarks:"));

                const reason = reasonText?.replace("Reason:", "").trim() || null;
                if (reasonFilter && reason !== reasonFilter) continue;
                
                const remarks = remarksText?.replace("Remarks:", "").trim() || null;
                
                const qtyMatch = actionText.match(/\d+/);
                const amount = qtyMatch ? parseInt(qtyMatch[0]) : 0;

                const changeDirection =
                    actionText.toLowerCase().includes("added")
                        ? "Added"
                        : actionText.toLowerCase().includes("removed")
                            ? "Removed"
                            : null;

                const explicitFinalStock = stockText
                    ? parseInt(stockText.replace("Updated stock:", "").trim())
                    : null;
                
                // Enhanced search - check all visible fields including change amount and final stock
                if (search) {
                    const searchLower = search.toLowerCase();
                    const matchesProductName = product.name?.toLowerCase().includes(searchLower);
                    const matchesSku = product.sku?.toLowerCase().includes(searchLower);
                    const matchesAction = actionText.toLowerCase().includes(searchLower);
                    const matchesReason = reason?.toLowerCase().includes(searchLower);
                    const matchesRemarks = remarks?.toLowerCase().includes(searchLower);
                    const matchesTimestamp = timestamp.toLocaleString('en-US').toLowerCase().includes(searchLower);
                    const matchesChangeAmount = amount.toString().includes(searchLower);
                    const matchesChangeDirection = changeDirection?.toLowerCase().includes(searchLower);
                    const matchesFinalStock = explicitFinalStock?.toString().includes(searchLower);
                    
                    if (!matchesProductName && !matchesSku && !matchesAction && !matchesReason && 
                        !matchesRemarks && !matchesTimestamp && !matchesChangeAmount && 
                        !matchesChangeDirection && !matchesFinalStock) {
                        continue;
                    }
                }

                productLogs.push({
                    productId: product.id,
                    productName: product.name,
                    sku: product.sku,
                    timestamp,
                    action: actionText,
                    reason,
                    remarks,
                    changeAmount: amount,
                    changeDirection,
                    explicitFinalStock,
                    minStockThreshold: product.minStockThreshold,
                    raw: entry
                });
            }

            /* Sort OLDEST → NEWEST for reconstruction */
            productLogs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

            /* ---------------- FINAL STOCK RECONSTRUCTION ---------------- */
            let stockAfterAllChanges = product.availableStock;

            for (let i = productLogs.length - 1; i >= 0; i--) {
                const log = productLogs[i];

                if (log.explicitFinalStock !== null) {
                    stockAfterAllChanges = log.explicitFinalStock;
                    break;
                }

                if (log.changeDirection === "Added") {
                    stockAfterAllChanges -= log.changeAmount;
                } else if (log.changeDirection === "Removed") {
                    stockAfterAllChanges += log.changeAmount;
                }
            }

            /* ---------------- ASSIGN FINAL STOCK PER LOG ---------------- */
            for (const log of productLogs) {
                if (log.explicitFinalStock !== null) {
                    log.finalStock = log.explicitFinalStock;
                    stockAfterAllChanges = log.explicitFinalStock;
                } else {
                    if (log.changeDirection === "Added") {
                        stockAfterAllChanges += log.changeAmount;
                    } else if (log.changeDirection === "Removed") {
                        stockAfterAllChanges -= log.changeAmount;
                    }
                    log.finalStock = stockAfterAllChanges;
                }

                delete log.explicitFinalStock;
                finalLogs.push(log);
            }
        }

        /* ---------------- FINAL SORT: NEWEST → OLDEST ---------------- */
        finalLogs.sort(
            (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        );

        return NextResponse.json({
            count: finalLogs.length,
            logs: finalLogs
        });

    } catch (error) {
        console.error("Inventory Logs API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch inventory logs" },
            { status: 500 }
        );
    }
}
