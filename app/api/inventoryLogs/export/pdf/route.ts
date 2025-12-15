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
        if (session.user.role !== "ADMIN" && session.user.role !== "CLIENT") {
            const perms = session.user.permissions || [];
            if (!hasPermission(perms, RESOURCES.ANALYTICS, PERMISSIONS.EXPORT)) {
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
        const clientId = searchParams.get("clientId");
        const status = searchParams.get("status");
        const period = searchParams.get("period") || "30d";

        // Determine client → which company they belong to
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
            { error: "Failed to export PDF", details: String(err) },
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
        const now = new Date();
        const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
        dateFilter.gte = new Date(now.getTime() - days * 86400000);
    }

    const productWhere: any = {};
    if (productId) productWhere.id = productId;
    if (session.user.role === "CLIENT" && companyID)
        productWhere.companies = { some: { id: companyID } };

    const products = await prisma.product.findMany({
        where: productWhere,
        select: { id: true, name: true, sku: true, inventoryLogs: true },
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
        for (const log of product.inventoryLogs) {
            let timestamp: Date | null = null;
            let action = "";
            let qty = 0;
            let extractedReason: string | null = null;

            if (log.startsWith("{")) {
                const parsed = JSON.parse(log);
                timestamp = new Date(parsed.date);
                qty = parseInt(parsed.change);
                extractedReason = parsed.reason;
                action =
                    qty > 0
                        ? `Added ${qty} units`
                        : `Removed ${Math.abs(qty)} units`;
            } else {
                const parts = log.split(" | ");
                if (parts.length < 3) continue;

                timestamp = new Date(parts[0]);
                action = parts[1];
                extractedReason = parts[2].replace("Reason:", "").trim();

                const match = action.match(/\d+/);
                const parsedQty = match ? parseInt(match[0]) : 0;

                qty = action.toLowerCase().includes("added")
                    ? parsedQty
                    : action.toLowerCase().includes("removed")
                        ? -parsedQty
                        : 0;
            }

            // Apply filters
            if (!timestamp) continue;
            if (dateFilter.gte && timestamp < dateFilter.gte) continue;
            if (dateFilter.lte && timestamp > dateFilter.lte) continue;
            if (reason && extractedReason !== reason) continue;
            if (search && !log.toLowerCase().includes(search.toLowerCase())) continue;

            total++;

            if (y < 100) {
                page = pdf.addPage([595.28, 841.89]);
                y = 800;
            }

            page.drawText(product.name, { x: m, y, size: 12, font: boldFont });
            y -= lh;

            page.drawText(`SKU: ${product.sku}`, { x: m, y, size: 10, font });
            y -= lh;

            page.drawText(`Timestamp: ${timestamp.toLocaleString()}`, {
                x: m, y, size: 10, font
            });
            y -= lh;

            page.drawText(`Action: ${action}`, { x: m, y, size: 10, font });
            y -= lh;

            page.drawText(`Quantity: ${qty}`, { x: m, y, size: 10, font });
            y -= lh;

            page.drawText(`Reason: ${extractedReason}`, { x: m, y, size: 10, font });
            y -= lh;

            page.drawText(`Raw Log:`, { x: m, y, size: 10, font: boldFont });
            y -= lh;

            const wrapped = wrapText(log, 90);
            for (const line of wrapped) {
                page.drawText(line, { x: m + 20, y, size: 9, font });
                y -= lh;
                if (y < 100) {
                    page = pdf.addPage([595.28, 841.89]);
                    y = 800;
                }
            }

            y -= 20;
        }
    }

    if (y < 80) {
        page = pdf.addPage([595.28, 841.89]);
        y = 800;
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
   HELPERS
============================================================ */
function sendPDF(bytes: Uint8Array, filename: string) {
    const name = `${filename}_${new Date().toISOString().split("T")[0]}.pdf`;

    return new NextResponse(Buffer.from(bytes), {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${name}"`
        }
    });
}

function wrapText(text: string, maxLen: number) {
    const words = text.split(" ");
    const lines = [];
    let line = "";

    for (const word of words) {
        if ((line + word).length > maxLen) {
            lines.push(line);
            line = word + " ";
        } else line += word + " ";
    }
    if (line.trim()) lines.push(line.trim());
    return lines;
}
