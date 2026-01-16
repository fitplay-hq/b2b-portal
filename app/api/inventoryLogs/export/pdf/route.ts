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
    const margin = 20;
    const rowHeight = 24; // Increased for 2-line product names
    const cellPadding = 4;
    const tableWidth = 555;

    // Column positions and widths (reduced spacing)
    const cols = {
        product: { x: margin, width: 120 },
        sku: { x: margin + 120, width: 80 },
        date: { x: margin + 200, width: 100 },
        qty: { x: margin + 300, width: 40 },
        stock: { x: margin + 340, width: 40 },
        reason: { x: margin + 380, width: 175 }
    };

    // Helper function to wrap text to multiple lines
    const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        
        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = font.widthOfTextAtSize(testLine, fontSize);
            
            if (testWidth > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) lines.push(currentLine);
        return lines.slice(0, 2); // Max 2 lines
    };

    // Helper function to draw cell borders
    const drawCellBorders = (page: any, x: number, y: number, width: number, height: number) => {
        // Left border
        page.drawLine({ start: { x, y: y + height }, end: { x, y }, thickness: 0.5 });
        // Right border
        page.drawLine({ start: { x: x + width, y: y + height }, end: { x: x + width, y }, thickness: 0.5 });
        // Top border
        page.drawLine({ start: { x, y: y + height }, end: { x: x + width, y: y + height }, thickness: 0.5 });
        // Bottom border
        page.drawLine({ start: { x, y }, end: { x: x + width, y }, thickness: 0.5 });
    };

    // Title
    page.drawText("Inventory Logs Report", {
        x: margin,
        y,
        size: 18,
        font: boldFont
    });
    y -= 35;

    const headerHeight = 20;
    const headerY = y;

    // Draw header row borders
    drawCellBorders(page, cols.product.x, headerY - headerHeight, cols.product.width, headerHeight);
    drawCellBorders(page, cols.sku.x, headerY - headerHeight, cols.sku.width, headerHeight);
    drawCellBorders(page, cols.date.x, headerY - headerHeight, cols.date.width, headerHeight);
    drawCellBorders(page, cols.qty.x, headerY - headerHeight, cols.qty.width, headerHeight);
    drawCellBorders(page, cols.stock.x, headerY - headerHeight, cols.stock.width, headerHeight);
    drawCellBorders(page, cols.reason.x, headerY - headerHeight, cols.reason.width, headerHeight);

    // Table Header text
    page.drawText("Product", { x: cols.product.x + cellPadding, y: headerY - 13, size: 9, font: boldFont });
    page.drawText("SKU", { x: cols.sku.x + cellPadding, y: headerY - 13, size: 9, font: boldFont });
    page.drawText("Date & Time", { x: cols.date.x + cellPadding, y: headerY - 13, size: 9, font: boldFont });
    page.drawText("Qty", { x: cols.qty.x + cellPadding, y: headerY - 13, size: 9, font: boldFont });
    page.drawText("Stock", { x: cols.stock.x + cellPadding, y: headerY - 13, size: 9, font: boldFont });
    page.drawText("Reason", { x: cols.reason.x + cellPadding, y: headerY - 13, size: 9, font: boldFont });

    y = headerY - headerHeight;

    const rowFontSize = 7;

    // Table Rows
    for (const log of finalLogs) {
        if (y < 60) {
            page = pdf.addPage([595.28, 841.89]);
            y = 800;
            
            // Redraw header on new page
            const newHeaderY = y;
            drawCellBorders(page, cols.product.x, newHeaderY - headerHeight, cols.product.width, headerHeight);
            drawCellBorders(page, cols.sku.x, newHeaderY - headerHeight, cols.sku.width, headerHeight);
            drawCellBorders(page, cols.date.x, newHeaderY - headerHeight, cols.date.width, headerHeight);
            drawCellBorders(page, cols.qty.x, newHeaderY - headerHeight, cols.qty.width, headerHeight);
            drawCellBorders(page, cols.stock.x, newHeaderY - headerHeight, cols.stock.width, headerHeight);
            drawCellBorders(page, cols.reason.x, newHeaderY - headerHeight, cols.reason.width, headerHeight);
            
            page.drawText("Product", { x: cols.product.x + cellPadding, y: newHeaderY - 13, size: 9, font: boldFont });
            page.drawText("SKU", { x: cols.sku.x + cellPadding, y: newHeaderY - 13, size: 9, font: boldFont });
            page.drawText("Date & Time", { x: cols.date.x + cellPadding, y: newHeaderY - 13, size: 9, font: boldFont });
            page.drawText("Qty", { x: cols.qty.x + cellPadding, y: newHeaderY - 13, size: 9, font: boldFont });
            page.drawText("Stock", { x: cols.stock.x + cellPadding, y: newHeaderY - 13, size: 9, font: boldFont });
            page.drawText("Reason", { x: cols.reason.x + cellPadding, y: newHeaderY - 13, size: 9, font: boldFont });
            
            y = newHeaderY - headerHeight;
        }

        const rowY = y;

        // Draw row cell borders
        drawCellBorders(page, cols.product.x, rowY - rowHeight, cols.product.width, rowHeight);
        drawCellBorders(page, cols.sku.x, rowY - rowHeight, cols.sku.width, rowHeight);
        drawCellBorders(page, cols.date.x, rowY - rowHeight, cols.date.width, rowHeight);
        drawCellBorders(page, cols.qty.x, rowY - rowHeight, cols.qty.width, rowHeight);
        drawCellBorders(page, cols.stock.x, rowY - rowHeight, cols.stock.width, rowHeight);
        drawCellBorders(page, cols.reason.x, rowY - rowHeight, cols.reason.width, rowHeight);

        // Product name with text wrapping (max 2 lines)
        const productLines = wrapText(log.productName, cols.product.width - cellPadding * 2, rowFontSize);
        productLines.forEach((line, index) => {
            page.drawText(line, { 
                x: cols.product.x + cellPadding, 
                y: rowY - 9 - (index * 9), 
                size: rowFontSize, 
                font 
            });
        });

        page.drawText(log.sku, { x: cols.sku.x + cellPadding, y: rowY - 9, size: rowFontSize, font });
        page.drawText(
            log.timestamp.toLocaleString(),
            { x: cols.date.x + cellPadding, y: rowY - 9, size: rowFontSize, font }
        );
        page.drawText(
            `${log.changeDirection === "Added" ? "+" : "-"}${log.changeAmount}`,
            { x: cols.qty.x + cellPadding, y: rowY - 9, size: rowFontSize, font }
        );
        page.drawText(
            String(log.finalStock),
            { x: cols.stock.x + cellPadding, y: rowY - 9, size: rowFontSize, font }
        );
        
        // Reason with text wrapping
        const reasonLines = wrapText(log.reason || "N/A", cols.reason.width - cellPadding * 2, rowFontSize);
        reasonLines.forEach((line, index) => {
            page.drawText(line, { 
                x: cols.reason.x + cellPadding, 
                y: rowY - 9 - (index * 9), 
                size: rowFontSize, 
                font 
            });
        });

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
