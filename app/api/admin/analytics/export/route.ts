import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { hasPermission } from '@/lib/utils';
import { RESOURCES, PERMISSIONS } from '@/lib/utils';
import * as XLSX from 'xlsx';

/**
 * GET /api/admin/analytics/export
 * Export analytics data as CSV
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Export API called:', request.url);
    const session = await getServerSession(auth);
    
    if (!session?.user) {
      console.log('❌ No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ User authenticated:', session.user.email, 'Role:', session.user.role);

    // Check analytics export permission (ADMIN users have full access)
    if (session.user.role !== 'ADMIN') {
      const userPermissions = session.user.permissions || [];
      if (!hasPermission(userPermissions, RESOURCES.ANALYTICS, PERMISSIONS.EXPORT)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }
    }

    const { searchParams } = new URL(request.url);
    const exportType = searchParams.get('type') || 'orders'; // orders or inventory
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const clientId = searchParams.get('clientId');
    const companyId = searchParams.get('companyId');
    const status = searchParams.get('status');

    console.log('📊 Export parameters:', {
      exportType,
      dateFrom,
      dateTo,
      clientId,
      companyId,
      status
    });

    if (exportType === 'orders') {
      console.log('📦 Exporting orders data...');
      return await exportOrdersData(dateFrom, dateTo, clientId, companyId, status);
    } else if (exportType === 'inventory') {
      console.log('📋 Exporting inventory data...');
      return await exportInventoryData(companyId);
    } else {
      console.log('❌ Invalid export type:', exportType);
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
  console.log('📦 Starting orders export with filters:', { dateFrom, dateTo, clientId, companyId, status });
  
  // Build date filter
  const dateFilter: any = {};
  if (dateFrom) {
    dateFilter.gte = new Date(dateFrom);
  }
  if (dateTo) {
    dateFilter.lte = new Date(dateTo);
  }
  
  console.log('📅 Date filter:', dateFilter);

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

  console.log('📊 Orders found for export:', orders.length);

  // Generate Excel workbook
  const workbook = XLSX.utils.book_new();

  // Prepare data for Excel
  const excelData = (orders as any).map((order: any) => {
    // Build complete shipping address from components
    const addressParts = [
      order.deliveryAddress,
      order.city,
      order.state,
      order.pincode
    ].filter(part => part && part !== 'Address' && part !== 'City' && part !== 'State' && part !== '000000');
    
    const fullShippingAddress = addressParts.length > 0 ? addressParts.join(', ') : 'Address not provided';

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
      'Delivery Address': order.deliveryAddress || '',
      'City': order.city || '',
      'State': order.state || '',
      'Pincode': order.pincode || '',
      'Full Shipping Address': fullShippingAddress,
      'Delivery Service': order.deliveryService || '',
      'Mode of Delivery': order.modeOfDelivery || '',
      'Required By Date': order.requiredByDate ? new Date(order.requiredByDate).toLocaleDateString() : '',
      'Items Details': order.orderItems?.map((item: any) => 
        `${item.product?.name || 'Unknown'} (Qty: ${item.quantity}, Price: ₹${item.price})`
      ).join('; ') || ''
    };
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths for better readability
  const columnWidths = [
    { wch: 15 }, // Order ID
    { wch: 20 }, // Client Name
    { wch: 25 }, // Client Email
    { wch: 12 }, // Status
    { wch: 15 }, // Total Amount
    { wch: 12 }, // Items Count
    { wch: 15 }, // Order Date
    { wch: 20 }, // Consignee Name
    { wch: 15 }, // Consignee Phone
    { wch: 25 }, // Consignee Email
    { wch: 25 }, // Delivery Address
    { wch: 15 }, // City
    { wch: 15 }, // State
    { wch: 10 }, // Pincode
    { wch: 35 }, // Full Shipping Address
    { wch: 15 }, // Delivery Service
    { wch: 15 }, // Mode of Delivery
    { wch: 15 }, // Required By Date
    { wch: 50 }  // Items Details
  ];
  worksheet['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

  // Generate Excel buffer
  const excelBuffer = XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsx'
  });

  const filename = `orders_export_${new Date().toISOString().split('T')[0]}.xlsx`;

  console.log('� Excel generated, orders:', orders.length, 'filename:', filename);

  return new NextResponse(excelBuffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

/**
 * Export inventory data as CSV
 */
async function exportInventoryData(companyId: string | null) {
  console.log('📋 Starting inventory export with companyId:', companyId);
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

  // Generate Excel workbook
  const workbook = XLSX.utils.book_new();

  // Prepare data for Excel
  const excelData = products.map(product => {
    const stockQuantity = product.availableStock;
    const lowThreshold = 10; // Default since field doesn't exist
    const stockStatus = stockQuantity === 0 
      ? 'Out of Stock' 
      : stockQuantity <= lowThreshold
      ? 'Low Stock'
      : 'In Stock';
    
    const stockValue = stockQuantity * (product.price || 0);

    return {
      'Product ID': product.id,
      'Product Name': product.name,
      'SKU': product.sku,
      'Category': product.categories || 'Uncategorized',
      'Companies': product.companies.map(c => c.name).join(', '),
      'Stock Quantity': stockQuantity,
      'Low Stock Threshold': lowThreshold,
      'Unit Price': product.price || 0,
      'Stock Status': stockStatus,
      'Stock Value': stockValue,
      'Brand': product.brand || '',
      'Created Date': new Date(product.createdAt).toLocaleDateString(),
      'Last Updated': new Date(product.updatedAt).toLocaleDateString()
    };
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths for better readability
  const columnWidths = [
    { wch: 15 }, // Product ID
    { wch: 25 }, // Product Name
    { wch: 15 }, // SKU
    { wch: 15 }, // Category
    { wch: 20 }, // Companies
    { wch: 12 }, // Stock Quantity
    { wch: 15 }, // Low Stock Threshold
    { wch: 12 }, // Unit Price
    { wch: 12 }, // Stock Status
    { wch: 15 }, // Stock Value
    { wch: 15 }, // Brand
    { wch: 15 }, // Created Date
    { wch: 15 }  // Last Updated
  ];
  worksheet['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');

  // Generate Excel buffer
  const excelBuffer = XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsx'
  });

  const filename = `inventory_export_${new Date().toISOString().split('T')[0]}.xlsx`;

  console.log('📋 Excel generated, products:', products.length, 'filename:', filename);

  return new NextResponse(excelBuffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}