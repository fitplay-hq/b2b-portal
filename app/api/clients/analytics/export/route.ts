import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { hasPermission } from '@/lib/utils';
import { RESOURCES, PERMISSIONS } from '@/lib/utils';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

        const { searchParams} = new URL(request.url);
        const exportType = searchParams.get('type') || 'orders';
        const format = searchParams.get('format') || 'xlsx';
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');
        const clientId = searchParams.get('clientId');
        const status = searchParams.get('status');
        const period = searchParams.get('period') || '30d';
        const search = searchParams.get('search');
        const category = searchParams.get('category');

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
                companyID,
                format
            });
        }

        if (exportType === 'inventory') {
            return await exportInventoryData({ session, companyID, format, search, category });
        }

        return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to export analytics data' }, { status: 500 });
    }
}

async function exportOrdersData({ dateFrom, dateTo, clientId, status, period, session, companyID, format = 'xlsx' }: any) {
    const dateFilter: any = {};
    if (dateFrom) dateFilter.gte = new Date(dateFrom);
    if (dateTo) dateFilter.lte = new Date(dateTo);

    if (!dateFrom && !dateTo) {
        const now = new Date();
        const days = period === '7d' ? 7 : period === '30d' ? 30 : 0;
        if (days > 0) {
            dateFilter.gte = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        }
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

    if (format === 'pdf') {
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text('Orders Report', 20, 20);
        
        const tableColumns = [
            'Order ID',
            'Client Name', 
            'Order Date',
            'Status',
            'Total Amount',
            'Items Count'
        ];
        
        const tableRows = excelData.map((order: any) => [
            order['Order ID'],
            order['Client Name'],
            order['Order Date'],
            order['Status'],
            `Rs.${order['Total Amount']}`,
            order['Items Count'].toString()
        ]);

        autoTable(doc, {
            head: [tableColumns],
            body: tableRows,
            startY: 30,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [66, 66, 66] }
        });

        const pdfBuffer = doc.output('arraybuffer');
        const filename = `orders_export_${new Date().toISOString().split('T')[0]}.pdf`;
        
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`
            }
        });
    }

    // Create Excel export
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

async function exportInventoryData({ session, companyID, format = 'xlsx', search, category }: any) {
    let inventoryWhere: any = {};

    if (session.user.role === 'CLIENT' && companyID) {
        inventoryWhere = { companies: { some: { id: companyID } } };
    }

    // Add search filter
    if (search && search.trim()) {
        inventoryWhere.OR = [
            { name: { contains: search.trim(), mode: 'insensitive' } },
            { sku: { contains: search.trim(), mode: 'insensitive' } },
            { brand: { contains: search.trim(), mode: 'insensitive' } }
        ];
    }

    // Add category filter
    if (category && category.trim()) {
        inventoryWhere.categories = { contains: category.trim(), mode: 'insensitive' };
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
        const stock = p.stockQuantity || p.availableStock || 0;
        const threshold = 10;

        return {
            'Product ID': p.id,
            'Product Name': p.name,
            'SKU': p.sku,
            'Category': p.category || p.categories || '',
            'Companies': p.companies.map((c: any) => c.name).join(', '),
            'Stock Quantity': stock,
            'Stock Status':
                stock === 0 ? 'Out of Stock' : stock <= threshold ? 'Low Stock' : 'In Stock',
            'Unit Price': p.unitPrice || p.price || 0,
            'Stock Value': (p.unitPrice || p.price || 0) * stock,
            'Brand': p.brand || '',
            'Created Date': new Date(p.createdAt).toLocaleDateString(),
            'Last Updated': new Date(p.updatedAt).toLocaleDateString()
        };
    });

    if (format === 'pdf') {
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text('Products Inventory Report', 20, 20);
        
        const tableColumns = [
            'Product ID',
            'Product Name', 
            'SKU',
            'Category',
            'Stock Quantity',
            'Stock Status',
            'Unit Price'
        ];
        
        const tableRows = excelData.map((product: any) => [
            product['Product ID'],
            product['Product Name'],
            product['SKU'],
            product['Category'],
            product['Stock Quantity'].toString(),
            product['Stock Status'],
            `Rs.${product['Unit Price']}`
        ]);

        autoTable(doc, {
            head: [tableColumns],
            body: tableRows,
            startY: 30,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [66, 66, 66] }
        });

        const pdfBuffer = doc.output('arraybuffer');
        const filename = `products_export_${new Date().toISOString().split('T')[0]}.pdf`;
        
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`
            }
        });
    }

    // Create Excel export
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const filename = `products_export_${new Date().toISOString().split('T')[0]}.xlsx`;

    return new NextResponse(buffer, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="${filename}"`
        }
    });
}
