import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { hasPermission } from '@/lib/utils';
import { RESOURCES, PERMISSIONS } from '@/lib/utils';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import puppeteer from 'puppeteer-core';
import os from 'os';

export const runtime = 'nodejs';
export const maxDuration = 60;

function logError(step: string, error: unknown) {
  console.error(`❌ [PDF EXPORT ERROR] Step: ${step}`);

  if (error instanceof Error) {
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
  } else {
    console.error('Unknown error:', error);
  }
}



function getLocalChromePath() {
  const platform = os.platform();

  if (platform === 'darwin') {
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  }

  if (platform === 'win32') {
    return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  }

  return '/usr/bin/google-chrome';
}



const isServerless =
  process.env.VERCEL === '1' ||
  !!process.env.AWS_LAMBDA_FUNCTION_VERSION;

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

    // Check analytics export permission (ADMIN and SYSTEM_USER with admin role have full access)
    const isAdmin = session.user.role === 'ADMIN';
    const isSystemAdmin = session.user.role === 'SYSTEM_USER' &&
      session.user.systemRole &&
      session.user.systemRole.toLowerCase() === 'admin';
    const hasAdminAccess = isAdmin || isSystemAdmin;

    if (!hasAdminAccess) {
      const userPermissions = session.user.permissions || [];
      if (!hasPermission(userPermissions, RESOURCES.ANALYTICS, PERMISSIONS.EXPORT)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }
    }

    const { searchParams } = new URL(request.url);
    const exportType = searchParams.get('type') || 'orders'; // orders or inventory
    const format = searchParams.get('format') || 'xlsx'; // xlsx or pdf
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
      return await exportOrdersData(dateFrom, dateTo, clientId, companyId, status, format);
    } else if (exportType === 'inventory') {
      console.log('📋 Exporting inventory data...');
      return await exportInventoryData(companyId, format);
    } else {
      console.log('❌ Invalid export type:', exportType);
      return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    }

  } catch (error) {
    logError('EXPORT_API_ROOT', error);

    return NextResponse.json(
      {
        error: 'Failed to export analytics data',
        details:
          error instanceof Error
            ? error.message
            : 'Unknown server error',
      },
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
  status: string | null,
  format: string = 'xlsx'
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
/**
 * Export inventory data as CSV
 */
/**
 * Export inventory data as CSV
 */
async function exportInventoryData(companyId: string | null, format: string = 'xlsx') {
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
    const lowThreshold = 10;
    const stockStatus = stockQuantity === 0
      ? 'Out of Stock'
      : stockQuantity <= lowThreshold
        ? 'Low Stock'
        : 'In Stock';

    const stockValue = stockQuantity * (product.price || 0);

    // Get first image URL if images is an array or string
    let imageUrl = '';
    if (product.images) {
      if (Array.isArray(product.images)) {
        imageUrl = product.images[0] || '';
      } else if (typeof product.images === 'string') {
        imageUrl = product.images;
      }
    }

    return {
      'Product ID': product.id,
      'Product Name': product.name,
      'Product Image': imageUrl ? imageUrl : 'No Image',
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

  // Add hyperlinks to the Product Image column (Column C)
  products.forEach((product, index) => {
    if (product.images) {
      // Extract image URL - handle both string and array
      let imageUrl = '';
      if (Array.isArray(product.images)) {
        imageUrl = product.images[0] || '';
      } else if (typeof product.images === 'string') {
        imageUrl = product.images;
      }

      // Only add hyperlink if we have a valid string URL
      if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
        const cellAddress = `C${index + 2}`; // Column C, starting from row 2
        worksheet[cellAddress] = {
          t: 's',
          v: 'View Image',
          l: { Target: imageUrl, Tooltip: 'Click to view product image' }
        };
      }
    }
  });

  // Set column widths for better readability
  const columnWidths = [
    { wch: 15 }, // Product ID
    { wch: 25 }, // Product Name
    { wch: 15 }, // Product Image
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

  function generateInventoryHTML(products: any[]) {
    return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial; font-size: 12px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ccc; padding: 6px; }
      th { background: #f3f4f6; }
      img { width: 60px; height: 60px; object-fit: cover; }
    </style>
  </head>
  <body>
    <h2>Inventory Report</h2>
    <table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>SKU</th>
          <th>Stock</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${products.map(p => `
          <tr>
            <td><img src="${Array.isArray(p.images) ? p.images[0] : ''}" /></td>
            <td>${p.name}</td>
            <td>${p.sku}</td>
            <td>${p.availableStock}</td>
            <td>₹${p.price}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </body>
  </html>
  `;
  }

  if (format === 'pdf') {
    try {
      console.log('🧪 PDF: Generating HTML');
      const html = generateInventoryHTML(products);

      console.log('🧪 PDF: Resolving executable path');
      console.log('🧪 PDF: Launching browser');

      const chromium = (await import('@sparticuz/chromium-min')).default;

      const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: process.env.NODE_ENV === 'production'
          ? await chromium.executablePath()
          : getLocalChromePath(),
        headless: true,
      });

      console.log('🧪 PDF: Creating page');
      const page = await browser.newPage();

      console.log('🧪 PDF: Setting HTML content');
      await page.setContent(html, { waitUntil: 'networkidle0' });

      console.log('🧪 PDF: Generating PDF buffer');
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          bottom: '20px',
          left: '20px',
          right: '20px',
        },
      });

      console.log('🧪 PDF: Closing browser');
      await browser.close();

      console.log('✅ PDF: Successfully generated');

      return new NextResponse(Buffer.from(pdfBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=inventory_${Date.now()}.pdf`,
        },
      });

    } catch (error) {
      logError('INVENTORY_PDF_FLOW', error);
      return NextResponse.json(
        {
          error: 'Inventory PDF generation failed',
          details:
            error instanceof Error
              ? error.message
              : 'Unknown PDF error',
        },
        { status: 500 }
      );
    }
  }

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