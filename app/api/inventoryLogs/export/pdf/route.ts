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
        const isAdmin = session.user.role === "ADMIN";
        const isSystemAdmin = session.user.role === "SYSTEM_USER" && 
                             session.user.systemRole && 
                             session.user.systemRole.toLowerCase() === "admin";
        const hasAdminAccess = isAdmin || isSystemAdmin;
        
        if (!hasAdminAccess) {
            const userPermissions = session.user.permissions || [];
            if (!hasPermission(userPermissions, RESOURCES.INVENTORY, PERMISSIONS.READ)) {
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
                select: { companyID: true }
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
                companyID
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
    companyID
}: any) {

    const dateFilter: any = {};
    if (dateFrom) dateFilter.gte = new Date(dateFrom);
    if (dateTo) dateFilter.lte = new Date(dateTo);

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
            inventoryLogs: true
        },
        orderBy: { name: "asc" }
    });

    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

    let page = pdf.addPage([595.28, 841.89]);
    let y = 800;
    const m = 40;
    const lh = 14;

    page.drawText("Inventory Logs Report", { x: m, y, size: 20, font: boldFont });
    y -= 25;

    let total = 0;

    for (const product of products) {

        /* ================= BACKWARD STOCK CALC ================= */
        let runningStock = product.availableStock ?? 0;

        const parsedLogs = product.inventoryLogs
            .map(raw => parseInventoryLog(raw))
            .filter((log): log is NonNullable<typeof log> => log !== null)
            .sort((a: any, b: any) => b.timestamp - a.timestamp);

        for (const log of parsedLogs) {
            if (log.updatedStock == null) {
                log.updatedStock = runningStock;
                runningStock =
                    log.changeDirection === "Added"
                        ? runningStock - log.changeAmount
                        : runningStock + log.changeAmount;
            }
        }

        parsedLogs.reverse();
        /* ======================================================== */

        for (const log of parsedLogs) {
            if (dateFilter.gte && log.timestamp < dateFilter.gte) continue;
            if (dateFilter.lte && log.timestamp > dateFilter.lte) continue;
            if (reason && log.reason !== reason) continue;
            if (search && !log.raw.toLowerCase().includes(search.toLowerCase())) continue;

            total++;

            if (y < 100) {
                page = pdf.addPage([595.28, 841.89]);
                y = 800;
            }

            page.drawText(product.name, { x: m, y, size: 12, font: boldFont });
            y -= lh;

            page.drawText(`SKU: ${product.sku}`, { x: m, y, size: 10, font });
            y -= lh;

            page.drawText(`Timestamp: ${log.timestamp.toLocaleString()}`, { x: m, y, size: 10, font });
            y -= lh;

            page.drawText(`Action: ${log.action}`, { x: m, y, size: 10, font });
            y -= lh;

            page.drawText(`Quantity: ${log.changeDirection === "Added" ? "+" : "-"}${log.changeAmount}`, {
                x: m, y, size: 10, font
            });
            y -= lh;

            page.drawText(`Updated Stock: ${log.updatedStock}`, { x: m, y, size: 10, font });
            y -= lh;

            page.drawText(`Reason: ${log.reason}`, { x: m, y, size: 10, font });
            y -= lh;

            y -= 15;
        }
    }

    page.drawText(`Total Logs: ${total}`, {
        x: m,
        y,
        size: 12,
        font: boldFont
    });

    const bytes = await pdf.save();
    return sendPDF(bytes, "inventory_logs_export");
}

/* ============================================================
   HELPERS (NEW – SAFE ADDITION)
============================================================ */
function parseInventoryLog(raw: string) {
    try {
        const parts = raw.split(" | ");

        const timestamp = new Date(parts[0]);
        const actionText = parts[1] || "";
        const reasonPart = parts.find(p => p.startsWith("Reason:"));
        const stockPart = parts.find(p => p.startsWith("Updated stock"));

        const qty = parseInt(actionText.match(/\d+/)?.[0] || "0");
        const isAdd = actionText.toLowerCase().includes("added");

        return {
            raw,
            timestamp,
            action: actionText,
            changeAmount: qty,
            changeDirection: isAdd ? "Added" : "Removed",
            updatedStock: stockPart ? parseInt(stockPart.match(/\d+/)?.[0] || "") : null,
            reason: reasonPart?.replace("Reason:", "").trim() || null
        };
    } catch {
        return null;
    }
}

function sendPDF(bytes: Uint8Array, filename: string) {
    const name = `${filename}_${new Date().toISOString().split("T")[0]}.pdf`;

    return new NextResponse(Buffer.from(bytes), {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${name}"`
        }
    });
}
