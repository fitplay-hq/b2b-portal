import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { hasPermission } from '@/lib/utils';
import { RESOURCES, PERMISSIONS } from '@/lib/utils';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(auth);
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Check permissions - ADMIN has full access, others need inventory view permission
        const isAdmin = session.user.role === 'ADMIN';
        const isSystemAdmin = session.user.role === 'SYSTEM_USER' && 
                             session.user.systemRole && 
                             session.user.systemRole.toLowerCase() === 'admin';
        const hasAdminAccess = isAdmin || isSystemAdmin;
        
        if (!hasAdminAccess) {
            const userPermissions = session.user.permissions || [];
            if (!hasPermission(userPermissions, RESOURCES.INVENTORY, PERMISSIONS.READ)) {
                return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
            }
        }

        const { searchParams } = new URL(request.url);
        const exportType = searchParams.get('type') || 'orders';

        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');
        const productId = searchParams.get('productId');
        const reason = searchParams.get('reason');
        const search = searchParams.get('search');
        const period = searchParams.get('period') || '30d';

        let companyID: string | null = null;

        if (session.user.role === 'CLIENT') {
            const client = await prisma.client.findUnique({
                where: { id: session.user.id },
                select: { companyID: true }
            });
            companyID = client?.companyID || null;
        }

        if (exportType === 'inventoryLogs') {
            return await exportInventoryLogsData({
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

        return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to export analytics data' }, { status: 500 });
    }
}

/* ----------------------- INVENTORY LOGS EXPORT ----------------------- */

async function exportInventoryLogsData({
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
        const days =
            period === "7d" ? 7 :
            period === "30d" ? 30 :
            period === "90d" ? 90 : 30;

        dateFilter.gte = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    }

    let productFilter: any = {};
    if (productId) productFilter.id = productId;

    if (session.user.role === "CLIENT" && companyID) {
        productFilter.companies = { some: { id: companyID } };
    }

    const products = await prisma.product.findMany({
        where: productFilter,
        select: {
            id: true,
            name: true,
            sku: true,
            inventoryLogs: true,
        }
    });

    const excelRows: any[] = [];

    for (const product of products) {
        for (const logEntry of product.inventoryLogs) {

            let timestamp: Date | null = null;
            let actionText = "";
            let quantity = 0;
            let extractedReason: string | null = null;

            // CASE 1: JSON LOG
            if (logEntry.startsWith("{")) {
                try {
                    const parsed = JSON.parse(logEntry);
                    timestamp = new Date(parsed.date);
                    quantity = parseInt(parsed.change);
                    extractedReason = parsed.reason;

                    actionText = quantity > 0
                        ? `Added ${quantity} units`
                        : `Removed ${Math.abs(quantity)} units`;

                } catch {
                    continue;
                }
            }
            // CASE 2: STRING FORMAT LOG
            else {
                const parts = logEntry.split(" | ");
                if (parts.length < 3) continue;

                const [timestampRaw, actionRaw, reasonRaw] = parts;
                timestamp = new Date(timestampRaw);
                actionText = actionRaw;

                const qtyMatch = actionRaw.match(/\d+/);
                const parsedQty = qtyMatch ? parseInt(qtyMatch[0]) : 0;

                const isAdd = actionRaw.toLowerCase().includes("added");
                const isRemove = actionRaw.toLowerCase().includes("removed");

                quantity = isAdd ? parsedQty : isRemove ? -parsedQty : 0;

                extractedReason = reasonRaw.replace("Reason:", "").trim();
            }

            /* FILTER APPLICATION */
            if (dateFilter.gte && timestamp < dateFilter.gte) continue;
            if (dateFilter.lte && timestamp > dateFilter.lte) continue;
            if (reason && extractedReason !== reason) continue;
            if (search && !logEntry.toLowerCase().includes(search.toLowerCase())) continue;

            excelRows.push({
                "Product ID": product.id,
                "Product Name": product.name,
                "SKU": product.sku,
                "Timestamp": timestamp.toLocaleString(),
                "Action": actionText,
                "Quantity": quantity,
                "Reason": extractedReason,
                "Raw Log": logEntry
            });
        }
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Logs");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    const filename = `inventory_logs_export_${new Date().toISOString().split("T")[0]}.xlsx`;

    return new NextResponse(buffer, {
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${filename}"`
        }
    });
}
