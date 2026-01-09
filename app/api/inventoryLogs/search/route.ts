import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(auth);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search")?.toLowerCase() || "";

        if (!search) {
            return NextResponse.json({ error: "Search query required" }, { status: 400 });
        }

        const productWhere: any = {};

        if (session.user.role === "CLIENT") {
            const client = await prisma.client.findUnique({
                where: { id: session.user.id },
                select: { companyID: true }
            });

            if (!client?.companyID) {
                return NextResponse.json({ count: 0, logs: [] });
            }

            productWhere.companies = {
                some: { id: client.companyID }
            };
        }


        if (session.user.role === "CLIENT") {
            const client = await prisma.client.findUnique({
                where: { id: session.user.id },
                select: { companyID: true }
            });

            if (client?.companyID) {
                productWhere.companies = {
                    some: { id: client.companyID }
                };
            } else {
                return NextResponse.json({ count: 0, logs: [] });
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

        for (const product of products) {
            const productLogs: any[] = [];

            for (const entry of product.inventoryLogs) {
                const parts = entry.split(" | ");
                if (parts.length < 2) continue;

                const timestamp = new Date(parts[0]);
                const actionText = parts[1];
                // const reasonText = parts.find(p => p.startsWith("Reason:"));
                const remarksText = parts.find(p => p.startsWith("Remarks:"));
                const stockText = parts.find(p => p.startsWith("Updated stock:"));

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

                const remarks = remarksText?.replace("Remarks:", "").trim() || null;
                // const reason = reasonText?.replace("Reason:", "").trim() || null;

                const matchesLogSearch =
                    product.name.toLowerCase().includes(search) ||
                    product.sku.toLowerCase().includes(search) ||
                    actionText.toLowerCase().includes(search) ||
                    // reason?.toLowerCase().includes(search) ||
                    remarks?.toLowerCase().includes(search);


                if (!matchesLogSearch) continue;

                productLogs.push({
                    productId: product.id,
                    productName: product.name,
                    sku: product.sku,
                    timestamp,
                    action: actionText,
                    // reason,
                    remarks,
                    changeAmount: amount,
                    changeDirection,
                    explicitFinalStock,
                    minStockThreshold: product.minStockThreshold
                });
            }

            productLogs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

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

        finalLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        return NextResponse.json({
            count: finalLogs.length,
            logs: finalLogs
        });

    } catch (error) {
        console.error("Inventory Search API Error:", error);
        return NextResponse.json(
            { error: "Failed to search inventory logs" },
            { status: 500 }
        );
    }
}
