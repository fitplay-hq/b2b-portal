import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { hasPermission, RESOURCES, PERMISSIONS } from '@/lib/utils';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(auth);
        if (!session?.user)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Check permissions - ADMIN has full access, others need inventory view permission
        // Exception: CLIENTs can export their own inventory logs without special permissions
        const isAdmin = session.user.role === 'ADMIN';
        const isSystemAdmin = session.user.role === 'SYSTEM_USER' &&
            session.user.systemRole &&
            session.user.systemRole.toLowerCase() === 'admin';
        const isClient = session.user.role === 'CLIENT';
        const hasAdminAccess = isAdmin || isSystemAdmin;

        if (!hasAdminAccess && !isClient) {
            const userPermissions = session.user.permissions || [];
            if (!hasPermission(userPermissions, RESOURCES.INVENTORY, PERMISSIONS.READ)) {
                return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
            }
        }

        const { searchParams } = new URL(request.url);

        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');
        const productId = searchParams.get('productId');
        const reasonFilter = searchParams.get('reason');
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

        return await exportInventoryLogsData({
            dateFrom,
            dateTo,
            period,
            productId,
            reasonFilter,
            search,
            session,
            companyID
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to export inventory logs' },
            { status: 500 }
        );
    }
}

/* ----------------------- INVENTORY LOGS EXPORT ----------------------- */

async function exportInventoryLogsData({
    dateFrom,
    dateTo,
    period,
    productId,
    reasonFilter,
    search,
    session,
    companyID
}: any) {

    /* ---------------- DATE FILTER ---------------- */
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (dateFrom) dateFilter.gte = new Date(dateFrom);
    if (dateTo) dateFilter.lte = new Date(dateTo);

    if (!dateFrom && !dateTo && period !== 'all') {
        const now = new Date();
        const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
        dateFilter.gte = new Date(now.getTime() - days * 86400000);
    }

    /* ---------------- PRODUCT FILTER ---------------- */
    const productWhere: any = {};
    if (productId) productWhere.id = productId;

    if (session.user.role === 'CLIENT' && companyID) {
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
        }
    });

    const excelRows: any[] = [];

    /* ---------------- PROCESS PER PRODUCT ---------------- */
    for (const product of products) {
        const productLogs: any[] = [];

        // 1️⃣ Parse logs
        for (const entry of product.inventoryLogs) {
            const parts = entry.split(' | ');
            if (parts.length < 3) continue;

            const timestamp = new Date(parts[0]);
            if (dateFilter.gte && timestamp < dateFilter.gte) continue;
            if (dateFilter.lte && timestamp > dateFilter.lte) continue;

            const actionText = parts[1];
            const reasonText = parts.find(p => p.startsWith('Reason:'));
            const stockText = parts.find(p => p.startsWith('Updated stock:'));
            const remarksText = parts.find(p => p.startsWith('Remarks:'));

            const reason = reasonText?.replace('Reason:', '').trim() || null;
            const remarks = remarksText?.replace('Remarks:', '').trim() || null;

            if (reasonFilter && reason !== reasonFilter) continue;

            if (search && !entry.toLowerCase().includes(search.toLowerCase())) continue;

            const qtyMatch = actionText.match(/\d+/);
            const amount = qtyMatch ? parseInt(qtyMatch[0]) : 0;

            const changeDirection =
                actionText.toLowerCase().includes('added')
                    ? 'Added'
                    : actionText.toLowerCase().includes('removed')
                        ? 'Removed'
                        : null;

            const explicitFinalStock = stockText
                ? parseInt(stockText.replace('Updated stock:', '').trim())
                : null;

            productLogs.push({
                timestamp,
                actionText,
                reason,
                remarks,
                changeAmount: amount,
                changeDirection,
                explicitFinalStock,
                raw: entry
            });
        }

        // 2️⃣ Sort OLDEST → NEWEST
        productLogs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        // 3️⃣ Reverse-walk to find base stock
        let stockAfterAllChanges = product.availableStock;

        for (let i = productLogs.length - 1; i >= 0; i--) {
            const log = productLogs[i];

            if (log.explicitFinalStock !== null) {
                stockAfterAllChanges = log.explicitFinalStock;
                break;
            }

            if (log.changeDirection === 'Added') {
                stockAfterAllChanges -= log.changeAmount;
            } else if (log.changeDirection === 'Removed') {
                stockAfterAllChanges += log.changeAmount;
            }
        }

        // 4️⃣ Assign final stock per log
        for (const log of productLogs) {
            if (log.explicitFinalStock !== null) {
                log.finalStock = log.explicitFinalStock;
                stockAfterAllChanges = log.explicitFinalStock;
            } else {
                if (log.changeDirection === 'Added') {
                    stockAfterAllChanges += log.changeAmount;
                } else if (log.changeDirection === 'Removed') {
                    stockAfterAllChanges -= log.changeAmount;
                }
                log.finalStock = stockAfterAllChanges;
            }

            excelRows.push({
                'Product Name': product.name,
                'SKU': product.sku,
                'Timestamp': log.timestamp.toLocaleString(),
                'Action': log.actionText,
                'Quantity Change':
                    log.changeDirection === 'Added'
                        ? log.changeAmount
                        : -log.changeAmount,
                'Reason': log.reason,
                'Remarks': log.remarks, // ✅ NEW COLUMN
                'Final Stock': log.finalStock,
                'Raw Log': log.raw
            });

        }
    }

    /* ---------------- SORT NEWEST → OLDEST ---------------- */
    excelRows.sort((a, b) => {
        const aTime = new Date(a["Timestamp"]).getTime();
        const bTime = new Date(b["Timestamp"]).getTime();
        return bTime - aTime;
    });

    /* ---------------- EXCEL GENERATION ---------------- */
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelRows);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Logs');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const filename = `inventory_logs_export_${new Date().toISOString().split('T')[0]}.xlsx`;

    return new NextResponse(buffer, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="${filename}"`
        }
    });
}
