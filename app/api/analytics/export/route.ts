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

        if (session.user.role !== 'ADMIN' && session.user.role !== 'CLIENT') {
            const perms = session.user.permissions || [];
            if (!hasPermission(perms, RESOURCES.ANALYTICS, PERMISSIONS.EXPORT)) {
                return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
            }
        }

        const { searchParams } = new URL(request.url);
        const exportType = searchParams.get('type') || 'orders';
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');
        const clientId = searchParams.get('clientId');
        const status = searchParams.get('status');
        const period = searchParams.get('period') || '30d';

        let companyID: string | null = null;

        if (session.user.role === 'CLIENT') {
            const client = await prisma.client.findUnique({
                where: { id: session.user.id },
                select: { companyID: true }
            });
            companyID = client?.companyID || null;
        }

        if (exportType === 'orders') {
            return await exportOrdersData({
                dateFrom,
                dateTo,
                clientId,
                status,
                period,
                session,
                companyID
            });
        }

        if (exportType === 'inventory') {
            return await exportInventoryData({ session, companyID });
        }

        return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to export analytics data' }, { status: 500 });
    }
}

async function exportOrdersData({ dateFrom, dateTo, clientId, status, period, session, companyID }: any) {
    const dateFilter: any = {};
    if (dateFrom) dateFilter.gte = new Date(dateFrom);
    if (dateTo) dateFilter.lte = new Date(dateTo);

    if (!dateFrom && !dateTo) {
        const now = new Date();
        const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
        dateFilter.gte = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    }

    const orderFilters: any = { createdAt: dateFilter };

    if (clientId) orderFilters.clientId = clientId;
    if (status) orderFilters.status = status;

    if (session.user.role === 'CLIENT') {
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
        orderBy: { createdAt: 'desc' }
    });

    const workbook = XLSX.utils.book_new();

    const excelData = orders.map((order: any) => {
        const addressParts = [
            order.deliveryAddress,
            order.city,
            order.state,
            order.pincode
        ].filter(x => x && x !== 'Address' && x !== 'City' && x !== 'State' && x !== '000000');

        return {
            'Order ID': order.id,
            'Client Name': order.client?.name || '',
            'Client Email': order.client?.email || '',
            'Status': order.status,
            'Total Amount': order.totalAmount || 0,
            'Items Count': order.orderItems?.length || 0,
            'Order Date': new Date(order.createdAt).toLocaleDateString(),
            'Consignee Name': order.consigneeName || '',
            'Consignee Phone': order.consigneePhone || '',
            'Consignee Email': order.consigneeEmail || '',
            'Full Shipping Address': addressParts.join(', ') || '',
            'Mode of Delivery': order.modeOfDelivery || '',
            'Required By Date': order.requiredByDate
                ? new Date(order.requiredByDate).toLocaleDateString()
                : '',
            'Items Details': order.orderItems
                .map((i: any) => `${i.product?.name} (Qty: ${i.quantity}, Price: ${i.price})`)
                .join('; ')
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const filename = `orders_export_${new Date().toISOString().split('T')[0]}.xlsx`;

    return new NextResponse(buffer, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="${filename}"`
        }
    });
}

async function exportInventoryData({ session, companyID }: any) {
    let inventoryWhere: any = {};

    if (session.user.role === 'CLIENT' && companyID) {
        inventoryWhere = { companies: { some: { id: companyID } } };
    }

    const products = await prisma.product.findMany({
        where: inventoryWhere,
        include: {
            companies: { select: { id: true, name: true } }
        },
        orderBy: { name: 'asc' }
    });

    const workbook = XLSX.utils.book_new();

    const excelData = products.map((p: any) => {
        const stock = p.availableStock;
        const threshold = 10;

        return {
            'Product ID': p.id,
            'Product Name': p.name,
            'SKU': p.sku,
            'Category': p.categories,
            'Companies': p.companies.map((c: any) => c.name).join(', '),
            'Stock Quantity': stock,
            'Stock Status':
                stock === 0 ? 'Out of Stock' : stock <= threshold ? 'Low Stock' : 'In Stock',
            'Unit Price': p.price,
            'Stock Value': (p.price || 0) * stock,
            'Brand': p.brand || '',
            'Created Date': new Date(p.createdAt).toLocaleDateString(),
            'Last Updated': new Date(p.updatedAt).toLocaleDateString()
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const filename = `inventory_export_${new Date().toISOString().split('T')[0]}.xlsx`;

    return new NextResponse(buffer, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="${filename}"`
        }
    });
}
