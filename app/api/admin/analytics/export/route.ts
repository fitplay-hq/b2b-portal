import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { hasPermission } from '@/lib/utils';
import { RESOURCES, PERMISSIONS } from '@/lib/utils';

/**
 * GET /api/admin/analytics/export
 * Export analytics data as CSV
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(auth);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check analytics export permission
    const userPermissions = session.user.permissions || [];
    if (!hasPermission(userPermissions, RESOURCES.ANALYTICS, PERMISSIONS.EXPORT)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const exportType = searchParams.get('type') || 'orders'; // orders or inventory
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const clientId = searchParams.get('clientId');
    const companyId = searchParams.get('companyId');
    const status = searchParams.get('status');

    if (exportType === 'orders') {
      return await exportOrdersData(dateFrom, dateTo, clientId, companyId, status);
    } else if (exportType === 'inventory') {
      return await exportInventoryData(companyId);
    } else {
      return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    }

  } catch (error) {
    console.error('Analytics Export API Error:', error);
    return NextResponse.json(
      { error: 'Failed to export analytics data' }, 
      { status: 500 }
    );
  }
}

/**
 * Export orders data as CSV
 */
async function exportOrdersData(
  dateFrom: string | null, 
  dateTo: string | null, 
  clientId: string | null, 
  companyId: string | null, 
  status: string | null
) {
  // Build date filter
  const dateFilter: any = {};
  if (dateFrom) {
    dateFilter.gte = new Date(dateFrom);
  }
  if (dateTo) {
    dateFilter.lte = new Date(dateTo);
  }

  // Build order filters
  const orderFilters: any = {};
  if (dateFrom || dateTo) {
    orderFilters.createdAt = dateFilter;
  }
  if (clientId) {
    orderFilters.clientId = clientId;
  }
  if (companyId) {
    orderFilters.companyId = companyId;
  }
  if (status) {
    orderFilters.status = status;
  }

  const orders = await prisma.order.findMany({
    where: orderFilters,
    include: {
      client: {
        select: { id: true, name: true, email: true }
      },
      orderItems: {
        include: {
          product: {
            select: { id: true, name: true, categories: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Generate CSV content
  const csvHeaders = [
    'Order ID',
    'Order Number', 
    'Client Name',
    'Client Email',
    'Company Name',
    'Status',
    'Total Amount',
    'Item Count',
    'Created Date',
    'Items Details'
  ];

  const csvRows = (orders as any).map((order: any) => [
    order.id,
    order.id, // Using id instead of orderNumber which doesn't exist 
    order.client?.name || '',
    order.client?.email || '',
    '', // No company relation available
    order.status,
    order.totalAmount || 0,
    order.orderItems?.length || 0,
    new Date(order.createdAt).toLocaleDateString(),
    order.orderItems?.map((item: any) => 
      `${item.product?.name || 'Unknown'} (${item.quantity}x)`
    ).join('; ') || ''
  ]);

  const csvContent = [
    csvHeaders.join(','),
    ...csvRows.map(row => 
      row.map(cell => 
        // Escape CSV fields that contain commas or quotes
        typeof cell === 'string' && (cell.includes(',') || cell.includes('"')) 
          ? `"${cell.replace(/"/g, '""')}"` 
          : cell
      ).join(',')
    )
  ].join('\n');

  const filename = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

/**
 * Export inventory data as CSV
 */
async function exportInventoryData(companyId: string | null) {
  const inventoryFilters: any = {};
  if (companyId) {
    inventoryFilters.companyId = companyId;
  }

  const products = await prisma.product.findMany({
    where: inventoryFilters,
    include: {
      companies: {
        select: { id: true, name: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  // Generate CSV content
  const csvHeaders = [
    'Product ID',
    'Product Name',
    'Category',
    'Company Name',
    'Stock Quantity',
    'Low Stock Threshold',
    'Unit Price',
    'Stock Status',
    'Stock Value',
    'Created Date'
  ];

  const csvRows = products.map(product => {
    const stockQuantity = product.availableStock;
    const lowThreshold = 10; // Default since field doesn't exist
    const stockStatus = stockQuantity === 0 
      ? 'Out of Stock' 
      : stockQuantity <= lowThreshold
      ? 'Low Stock'
      : 'In Stock';
    
    const stockValue = stockQuantity * (product.price || 0);

    return [
      product.id,
      product.name,
      product.categories || 'Uncategorized',
      product.companies.map(c => c.name).join(', '),
      stockQuantity,
      lowThreshold,
      product.price || 0,
      stockStatus,
      stockValue,
      new Date(product.createdAt).toLocaleDateString()
    ];
  });

  const csvContent = [
    csvHeaders.join(','),
    ...csvRows.map(row => 
      row.map(cell => 
        typeof cell === 'string' && (cell.includes(',') || cell.includes('"')) 
          ? `"${cell.replace(/"/g, '""')}"` 
          : cell
      ).join(',')
    )
  ].join('\n');

  const filename = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}