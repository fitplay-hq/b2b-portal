import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { hasPermission } from "@/lib/utils";
import { RESOURCES, PERMISSIONS } from "@/lib/utils";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(auth);
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        if (session.user.role !== "ADMIN" && session.user.role !== "CLIENT") {
            const perms = session.user.permissions || [];
            if (!hasPermission(perms, RESOURCES.ANALYTICS, PERMISSIONS.EXPORT)) {
                return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
            }
        }

        const { searchParams } = new URL(request.url);

        const exportType = searchParams.get("type") || "orders";
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");
        const clientId = searchParams.get("clientId");
        const status = searchParams.get("status");
        const period = searchParams.get("period") || "30d";

        let companyID: string | null = null;

        if (session.user.role === "CLIENT") {
            const client = await prisma.client.findUnique({
                where: { id: session.user.id },
                select: { companyID: true }
            });
            companyID = client?.companyID || null;
        }

        if (exportType === "orders") {
            return await exportOrdersPDF({
                dateFrom,
                dateTo,
                clientId,
                status,
                period,
                session,
                companyID
            });
        }

        if (exportType === "inventory") {
            return await exportInventoryPDF({
                session,
                companyID
            });
        }

        return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
    } catch (err) {
        console.error("PDF EXPORT ERROR:", err);
        return NextResponse.json({ error: String(err), message: "Failed to export pdf data" }, { status: 500, });
    }
}

async function exportOrdersPDF({ dateFrom, dateTo, clientId, status, period, session, companyID }: any) {
    const dateFilter: any = {};
    if (dateFrom) dateFilter.gte = new Date(dateFrom);
    if (dateTo) dateFilter.lte = new Date(dateTo);

    if (!dateFrom && !dateTo) {
        const now = new Date();
        const days = period === "7d" ? 7 : period === "30d" ? 30 : 0;
        if (days > 0) {
            dateFilter.gte = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        }
    }

    const orderFilters: any = { createdAt: dateFilter };

    if (clientId) orderFilters.clientId = clientId;
    if (status) orderFilters.status = status;

    if (session.user.role === "CLIENT") {
        orderFilters.client = { companyID };
    }

    const orders = await prisma.order.findMany({
        where: orderFilters,
        include: {
            client: { select: { id: true, name: true, email: true } },
            orderItems: {
                include: {
                    product: { select: { id: true, name: true, categories: true } }
                }
            }
        },
        orderBy: { createdAt: "desc" },
        take: 50
    });

    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

    let page = pdf.addPage([595.28, 841.89]);
    let y = 800;
    const m = 50;
    const lh = 15;

    page.drawText("Orders Export Report", { x: m, y, size: 20, font: boldFont });
    y -= 25;
    page.drawText(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, { x: m, y, size: 10, font });
    y -= 25;
    page.drawText(`Total Orders: ${orders.length}`, { x: m, y, size: 12, font: boldFont });
    y -= 35;

    for (const order of orders) {
        if (y < 100) {
            page = pdf.addPage([595.28, 841.89]);
            y = 800;
        }

        const addrParts = [
            order.deliveryAddress,
            order.city,
            order.state,
            order.pincode
        ].filter(x => x && !["Address", "City", "State", "000000"].includes(x));

        const fullAddress = addrParts.join(", ") || "Address not provided";

        page.drawText(`Order #${order.id.slice(-8)}`, { x: m, y, size: 12, font: boldFont });
        y -= lh;
        page.drawText(`Client: ${order.client?.name || "N/A"} | Status: ${order.status}`, { x: m, y, size: 10, font });
        y -= lh;
        page.drawText(`Amount: Rs${order.totalAmount} | Date: ${new Date(order.createdAt).toLocaleDateString('en-GB')}`, {
            x: m, y, size: 10, font
        });
        y -= lh;
        // --- MULTILINE SHIPPING ADDRESS FIX ---
        const shippingLines = String(fullAddress).split(/\r?\n/);

        page.drawText("Shipping:", { x: m, y, size: 10, font });
        y -= lh;

        for (const line of shippingLines) {
            if (y < 100) {
                page = pdf.addPage([595.28, 841.89]);
                y = 800;
            }
            page.drawText(String(line), { x: m + 15, y, size: 10, font });
            y -= lh;
        }
        // ---------------------------------------


        if (order.orderItems.length) {
            page.drawText("Items:", { x: m + 10, y, size: 10, font: boldFont });
            y -= lh;

            for (const item of order.orderItems) {
                if (y < 100) {
                    page = pdf.addPage([595.28, 841.89]);
                    y = 800;
                }

                page.drawText(
                    `• ${item.product?.name} - Qty: ${item.quantity}, Price: Rs${item.price}`,
                    { x: m + 20, y, size: 9, font }
                );
                y -= lh;
            }
        }

        y -= 20;
    }

    const bytes = await pdf.save();
    const filename = `orders_export_${new Date().toISOString().split("T")[0]}.pdf`;

    return new NextResponse(Buffer.from(bytes), {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${filename}"`
        }
    });
}

function wrapText(text: string, max: number) {
    const lines: string[] = [];
    if (text.includes(" ")) {
        const words = text.split(" ");
        let line = "";
        for (const word of words) {
            if ((line + word).length > max) {
                lines.push(line.trim());
                line = word + " ";
            } else line += word + " ";
        }
        if (line.trim()) lines.push(line.trim());
    } else {
        for (let i = 0; i < text.length; i += max) lines.push(text.slice(i, i + max));
    }
    return lines;
}

async function exportInventoryPDF({ session, companyID }: any) {
    let where: any = {};

    if (session.user.role === "CLIENT" && companyID) {
        where = { companies: { some: { id: companyID } } };
    }

    const products = await prisma.product.findMany({
        where: session.user.role === "CLIENT" && companyID ? { companies: { some: { id: companyID } } } : {},
        include: { companies: { select: { id: true, name: true } } },
        orderBy: { name: "asc" },
        take: 100
    });

    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

    let page = pdf.addPage([595.28, 841.89]);
    let y = 800;
    const m = 50;
    const lh = 15;

    page.drawText("Inventory Export Report", { x: m, y, size: 20, font: boldFont });
    y -= 25;
    page.drawText(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, { x: m, y, size: 10, font });
    y -= 25;
    page.drawText(`Total Products: ${products.length}`, { x: m, y, size: 12, font: boldFont });
    y -= 35;

    for (const p of products) {
        if (y < 100) {
            page = pdf.addPage([595.28, 841.89]);
            y = 800;
        }

        page.drawText(p.name, { x: m, y, size: 12, font: boldFont });
        y -= lh;

        const imageText = Array.isArray(p.images) ? p.images[0] || "" : p.images || "";
        page.drawText("Image URL:", { x: m, y, size: 10, font });
        y -= lh;

        const lines = wrapText(imageText, 100);
        for (const line of lines) {
            page.drawText(line, { x: m + 20, y, size: 9, font });
            y -= lh;
        }

        const stock = p.availableStock;
        const status =
            stock === 0 ? "Out of Stock" : stock <= 10 ? "Low Stock" : "In Stock";

        page.drawText(
            `SKU: ${p.sku} | Category: ${p.categories}`,
            { x: m, y, size: 10, font }
        );
        y -= lh;

        page.drawText(
            `Stock: ${stock} | Status: ${status} | Price: Rs${p.price || 0}`,
            { x: m, y, size: 10, font }
        );
        y -= lh;

        page.drawText(
            `Companies: ${p.companies.map(c => c.name).join(", ")}`,
            { x: m, y, size: 10, font }
        );
        y -= 25;
    }

    const bytes = await pdf.save();
    const filename = `inventory_export_${new Date().toISOString().split("T")[0]}.pdf`;

    return new NextResponse(Buffer.from(bytes), {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${filename}"`
        }
    });
}

