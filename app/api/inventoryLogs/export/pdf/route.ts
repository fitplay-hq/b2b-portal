import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { hasPermission, RESOURCES, PERMISSIONS } from "@/lib/utils";
import { PDFDocument, StandardFonts } from "pdf-lib";

/* ============================================================
   MAIN GET HANDLER
============================================================ */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(auth);
        if (!session?.user)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Permission check
        // Check permissions - ADMIN has full access, others need inventory view permission
        // Exception: CLIENTs can export their own inventory logs without special permissions
        const isAdmin = session.user.role === "ADMIN";
        const isSystemAdmin =
            session.user.role === "SYSTEM_USER" &&
            session.user.systemRole &&
            session.user.systemRole.toLowerCase() === "admin";
        const isClient = session.user.role === "CLIENT";
        const hasAdminAccess = isAdmin || isSystemAdmin;

        if (!hasAdminAccess && !isClient) {
            const userPermissions = session.user.permissions || [];
            if (
                !hasPermission(userPermissions, RESOURCES.INVENTORY, PERMISSIONS.READ)
            ) {
                return NextResponse.json(
                    { error: "Insufficient permissions" },
                    { status: 403 }
                );
            }
        }

        const { searchParams } = new URL(request.url);

        const exportType = searchParams.get("type");
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");
        const productId = searchParams.get("productId");
        const reason = searchParams.get("reason");
        const search = searchParams.get("search");
        const period = searchParams.get("period") || "30d";

        let companyID: string | null = null;
        if (session.user.role === "CLIENT") {
            const client = await prisma.client.findUnique({
                where: { id: session.user.id },
                select: { companyID: true },
            });
            companyID = client?.companyID || null;
        }

        if (exportType === "inventoryLogs") {
            return await exportInventoryLogsPDF({
                dateFrom,
                dateTo,
                period,
                productId,
                reason,
                search,
                session,
                companyID,
            });
        }

        return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
    } catch (err) {
        console.error("PDF EXPORT ERROR:", err);
        return NextResponse.json(
            { error: "Failed to export PDF" },
            { status: 500 }
        );
    }
}

/* ----------------------- INVENTORY LOGS EXPORT PDF ----------------------- */
async function exportInventoryLogsPDF({
    dateFrom,
    dateTo,
    period,
    productId,
    reason,
    search,
    session,
    companyID,
}: any) {
    const dateFilter: any = {};
    if (dateFrom) dateFilter.gte = new Date(dateFrom);
    if (dateTo) dateFilter.lte = new Date(dateTo);

    const normalizedSearch = search?.toLowerCase() || null;


    if (!dateFrom && !dateTo && period !== "all") {
        const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
        dateFilter.gte = new Date(Date.now() - days * 86400000);
    }

    const productWhere: any = {};
    if (productId) productWhere.id = productId;
    if (session.user.role === "CLIENT" && companyID) {
        productWhere.companies = { some: { id: companyID } };
    }

    const products = await prisma.product.findMany({
        where: productWhere,
        select: {
            id: true,
            name: true,
            sku: true,
            availableStock: true,
            inventoryLogs: true,
        },
    });

    products.sort((a, b) => {
        const aLatest = Math.max(
            ...a.inventoryLogs.map((l) => new Date(l.split(" | ")[0]).getTime())
        );
        const bLatest = Math.max(
            ...b.inventoryLogs.map((l) => new Date(l.split(" | ")[0]).getTime())
        );
        return bLatest - aLatest;
    });

    const finalLogs: any[] = [];

    /* ---------------- PROCESS EACH PRODUCT (same as main API) ---------------- */
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

            const reasonValue = reasonText?.replace("Reason:", "").trim() || null;
            if (reason && reasonValue !== reason) continue;

            if (normalizedSearch) {
                const matchesSearch =
                    product.name.toLowerCase().includes(normalizedSearch) ||
                    product.sku.toLowerCase().includes(normalizedSearch) ||
                    actionText.toLowerCase().includes(normalizedSearch) ||
                    parts.find(p => p.startsWith("Remarks:"))
                        ?.replace("Remarks:", "")
                        .trim()
                        .toLowerCase()
                        .includes(normalizedSearch);

                if (!matchesSearch) continue;
            }


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

            productLogs.push({
                productId: product.id,
                productName: product.name,
                sku: product.sku,
                timestamp,
                action: actionText,
                reason: reasonValue,
                changeAmount: amount,
                changeDirection,
                explicitFinalStock,
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


    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

    let page = pdf.addPage([595.28, 841.89]);
    let y = 800;
    const margin = 30;
    const rowHeight = 16;

    const cols = {
        product: margin,   // 30
        sku: 180,
        date: 270,
        qty: 370,
        stock: 420,
        reason: 470        // starts earlier → more width
    };


    // Title
    page.drawText("Inventory Logs Report", {
        x: margin,
        y,
        size: 18,
        font: boldFont
    });
    y -= 30;

    // Table Header
    page.drawText("Product", { x: cols.product, y, size: 10, font: boldFont });
    page.drawText("SKU", { x: cols.sku, y, size: 10, font: boldFont });
    page.drawText("Date & Time", { x: cols.date, y, size: 10, font: boldFont });
    page.drawText("Qty", { x: cols.qty, y, size: 10, font: boldFont });
    page.drawText("Stock", { x: cols.stock, y, size: 10, font: boldFont });
    page.drawText("Reason", { x: cols.reason, y, size: 10, font: boldFont });

    y -= rowHeight;

    // Divider
    page.drawLine({
        start: { x: margin, y },
        end: { x: 565, y },
        thickness: 1
    });

    y -= rowHeight;

    const rowFontSize = 7.6;

    // Table Rows
    for (const log of finalLogs) {
        if (y < 60) {
            page = pdf.addPage([595.28, 841.89]);
            y = 800;
        }

        page.drawText(log.productName, { x: cols.product, y, size: rowFontSize, font });
        page.drawText(log.sku, { x: cols.sku, y, size: rowFontSize, font });
        page.drawText(
            log.timestamp.toLocaleString(),
            { x: cols.date, y, size: rowFontSize, font }
        );
        page.drawText(
            `${log.changeDirection === "Added" ? "+" : "-"}${log.changeAmount}`,
            { x: cols.qty, y, size: rowFontSize, font }
        );
        page.drawText(
            String(log.finalStock),
            { x: cols.stock, y, size: rowFontSize, font }
        );
        page.drawText(
            log.reason || "N/A",
            { x: cols.reason, y, size: rowFontSize, font }
        );

        y -= rowHeight;
    }

    const bytes = await pdf.save();
    return sendPDF(bytes, "inventory_logs_export");

}

/* ============================================================
   HELPERS
============================================================ */
function sendPDF(bytes: Uint8Array, filename: string) {
    const name = `${filename}_${new Date().toISOString().split("T")[0]}.pdf`;

    return new NextResponse(Buffer.from(bytes), {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${name}"`,
        },
    });
}
