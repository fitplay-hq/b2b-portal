import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { hasPermission } from '@/lib/utils';
import { RESOURCES, PERMISSIONS } from '@/lib/utils';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
    // Try multiple common locations for Chrome on Windows
    const possiblePaths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
    ];

    // Check which path exists
    const fs = require('fs');
    for (const path of possiblePaths) {
      if (fs.existsSync(path)) {
        return path;
      }
    }

    // Return default if none found
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
    const session = await getServerSession(auth);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check analytics export permission (ADMIN and SYSTEM_USER with admin role have full access)
    const isAdmin = session.user.role === 'ADMIN';
    const isSystemAdmin = session.user.role === 'SYSTEM_USER' &&
      session.user.systemRole &&
      session.user.systemRole.toLowerCase() === 'admin';
    const isClient = session.user.role === 'CLIENT';
    const hasAdminAccess = isAdmin || isSystemAdmin;

    if (!hasAdminAccess && session.user.role !== 'CLIENT') {
      const userPermissions = session.user.permissions || [];
      if (!hasPermission(userPermissions, RESOURCES.ANALYTICS, PERMISSIONS.EXPORT)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }
    }

    let client;

    if (session.user.role === 'CLIENT') {
      client = await prisma.client.findUnique({
        where: { id: session.user.id }
      });

      if (!client) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
      }
    }

    const { searchParams } = new URL(request.url);
    const exportType = searchParams.get('type') || 'orders'; // orders or inventory
    const format = searchParams.get('format') || 'xlsx'; // xlsx or pdf
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const clientId = searchParams.get('clientId');
    let companyId = searchParams.get('companyId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subCategory');
    const stockStatus = searchParams.get('stockStatus');
    const sortBy = searchParams.get('sortBy');
    const productDateFrom = searchParams.get('productDateFrom');
    const productDateTo = searchParams.get('productDateTo');


    // For CLIENT users, use their company ID
    if (isClient && client) {
      companyId = client.companyID;
    }

    // Clients can only export inventory, not orders
    if (isClient && exportType !== 'inventory') {
      return NextResponse.json({ error: 'Clients can only export inventory' }, { status: 403 });
    }

    console.log('📊 Export parameters:', {
      exportType,
      dateFrom,
      dateTo,
      clientId,
      companyId,
      status,
      search,
      category
    });

    if (exportType === 'orders') {
      return await exportOrdersData(dateFrom, dateTo, clientId, companyId, status, format);
    } else if (exportType === 'inventory') {
      console.log('📋 Exporting inventory data...');
      // Use productDateFrom/productDateTo if available, otherwise fall back to dateFrom/dateTo
      const inventoryDateFrom = productDateFrom || dateFrom;
      const inventoryDateTo = productDateTo || dateTo;
      return await exportInventoryData(format, search, client, category, subCategory, inventoryDateFrom, inventoryDateTo, stockStatus, sortBy);
    } else {
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
      },
      bundleOrderItems: {
        include: {
          product: {
            select: { id: true, name: true, categories: true }
          }
        }
      },
    },
    orderBy: { createdAt: 'desc' }
  });

  // Generate Excel workbook
  const workbook = XLSX.utils.book_new();

  const client = await prisma.client.findUnique({
    where: { id: clientId || '' }
  });

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

    // 🔥 MERGE orderItems + bundleOrderItems correctly
    const mergedItemsMap = new Map<string, {
      product: any;
      quantity: number;
      price: number;
    }>();

    [...order.orderItems, ...order.bundleOrderItems].forEach((item: any) => {
      const productId = item.product?.id;
      if (!productId) return;

      if (!mergedItemsMap.has(productId)) {
        mergedItemsMap.set(productId, {
          product: item.product,
          quantity: item.quantity,
          price: item.price
        });
      } else {
        const existing = mergedItemsMap.get(productId)!;
        existing.quantity += item.quantity;
      }
    });

    const mergedItems = Array.from(mergedItemsMap.values());

    return {
      'Order ID': order.id,
      'Client Name': order.client?.name || '',
      'Client Email': order.client?.email || '',
      'Status': order.status,
      'Total Amount': order.totalAmount || 0,

      // ✅ UNIQUE product count (matches UI)
      'Items Count': mergedItems.reduce((sum, item) => sum + item.quantity, 0),

      // ✅ Each product shown ONCE with summed quantity
      'Items Details': mergedItems
        .map(item =>
          `${item.product.name} (Qty: ${item.quantity}, Price: ${item.price})`
        )
        .join('; '),

      'Order Date': new Date(order.createdAt).toLocaleDateString('en-GB'),
      'Consignee Name': order.consigneeName || '',
      'Consignee Phone': order.consigneePhone || '',
      'Consignee Email': order.consigneeEmail || '',
      'City': order.city || '',
      'State': order.state || '',
      'Pincode': order.pincode || '',
      'Full Shipping Address': fullShippingAddress,
      'Delivery Service': order.deliveryService || '',
      'Mode of Delivery': order.modeOfDelivery || '',
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
    { wch: 50 }, // Items Details
    { wch: 15 }, // Order Date
    { wch: 20 }, // Consignee Name
    { wch: 15 }, // Consignee Phone
    { wch: 25 }, // Consignee Email
    { wch: 15 }, // City
    { wch: 15 }, // State
    { wch: 10 }, // Pincode
    { wch: 35 }, // Full Shipping Address
    { wch: 15 }, // Delivery Service
    { wch: 15 }, // Mode of Delivery
  ];
  worksheet['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

  if (format === 'pdf') {
    // Use landscape orientation for better space utilization
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Title styling
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Orders Report', 8, 10);

    // Add export date
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, 8, 15);
    doc.setTextColor(0, 0, 0);

    const showPrice = client ? client.isShowPrice : true;

    const tableColumns = showPrice ? [
      'Order ID',
      'Client Name',
      'Status',
      'Qty',
      'Items Details',
      'Date',
      'Amount',
    ] : [
      'Order ID',
      'Client Name',
      'Status',
      'Qty',
      'Items Details',
      'Date',
    ];

    // Format items details - keep semicolons but make more compact
    const tableRows = excelData.map((order: any) => {
      const row = [
        order['Order ID'],
        order['Client Name'],
        order['Status'],
        order['Items Count'].toString(),
        order['Items Details'] || '',
        order['Order Date'],
      ];
      if (showPrice) {
        row.push(`${order['Total Amount']}`);
      }
      return row;
    });

    // A4 landscape: 297mm width, using minimal margins
    // Fixed widths that total ~285mm
    const columnStyles: any = showPrice ? {
      0: { cellWidth: 30, halign: 'left' },      // Order ID
      1: { cellWidth: 30, halign: 'left' },      // Client Name
      2: { cellWidth: 28, halign: 'center' },    // Status
      3: { cellWidth: 12, halign: 'center' },    // Qty
      4: { cellWidth: 138, halign: 'left' },     // Items Details - fixed large width
      5: { cellWidth: 22, halign: 'center' },    // Date
      6: { cellWidth: 22, halign: 'center' }      // Amount
    } : {
      0: { cellWidth: 32, halign: 'left' },      // Order ID
      1: { cellWidth: 34, halign: 'left' },      // Client Name
      2: { cellWidth: 30, halign: 'center' },    // Status
      3: { cellWidth: 14, halign: 'center' },    // Qty
      4: { cellWidth: 150, halign: 'left' },     // Items Details
      5: { cellWidth: 24, halign: 'center' },    // Date
    };

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 18,
      margin: { left: 6, right: 6, top: 8, bottom: 8 },

      styles: {
        fontSize: 8,
        cellPadding: 1.5,
        valign: 'middle',
        overflow: 'linebreak',
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
      },

      headStyles: {
        fillColor: [55, 65, 81],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        cellPadding: 2,
      },

      bodyStyles: {
        textColor: [40, 40, 40],
      },

      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },

      columnStyles: columnStyles,

      didParseCell: (data) => {
        // Style the Items Details column
        if (data.section === 'body' && data.column.index === 4) {
          data.cell.styles.fontSize = 7.5;
          data.cell.styles.valign = 'middle';
        }

        // Style status column
        if (data.section === 'body' && data.column.index === 2) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fontSize = 7.5;
        }
      },

      didDrawPage: (data) => {
        // Add page numbers
        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          doc.internal.pageSize.width - 25,
          doc.internal.pageSize.height - 5
        );
      }
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

function colToLetter(col: number) {
  let letter = '';
  while (col >= 0) {
    letter = String.fromCharCode((col % 26) + 65) + letter;
    col = Math.floor(col / 26) - 1;
  }
  return letter;
}

async function exportInventoryData(
  format: string = 'xlsx',
  search: string | null = null,
  client: any = null,
  category: string | null = null,
  subCategory: string | null = null,
  dateFrom: string | null = null,
  dateTo: string | null = null,
  stockStatus: string | null = null,
  sortBy: string | null = null
) {
  // console.log('📋 Starting inventory export with filters:', { search, category, sortBy });

  const dateFilter: any = {};
  if (dateFrom) dateFilter.gte = new Date(dateFrom);
  if (dateTo) dateFilter.lte = new Date(dateTo);


  const inventoryFilters: any = {};
  const andConditions: any[] = [];

  // Date filter
  if (Object.keys(dateFilter).length > 0) {
    inventoryFilters.createdAt = dateFilter;
  }

  // Client / company scope
  if (client) {
    andConditions.push({
      OR: [
        {
          clients: {
            some: { clientId: client?.id || '' }
          }
        }
      ]
    });
  }

  // Search filter
  if (search && search.trim()) {
    andConditions.push({
      OR: [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { sku: { contains: search.trim(), mode: 'insensitive' } },
        { brand: { contains: search.trim(), mode: 'insensitive' } }
      ]
    });
  }

  // Attach AND conditions
  if (andConditions.length > 0) {
    inventoryFilters.AND = andConditions;
  }

  // Category filter - filter by category name
  if (category && category.trim()) {
    inventoryFilters.category = {
      name: category.trim()
    };
  }

  // SubCategory filter - filter by subcategory name
  if (subCategory && subCategory.trim()) {
    inventoryFilters.subCategory = {
      name: subCategory.trim()
    };
  }

  const products = await prisma.product.findMany({
    where: inventoryFilters,
    include: {
      category: {
        select: { displayName: true }
      },
      subCategory: {
        select: { name: true }
      },
      companies: {
        select: { id: true, name: true }
      }
    },
    orderBy: { name: 'asc' }
  });


  const filteredProducts = products.filter(product => {
    const threshold = product.minStockThreshold;

    if (stockStatus === 'out-of-stock') {
      return product.availableStock === 0;
    }

    if (stockStatus === 'low-stock') {
      return threshold !== null &&
        product.availableStock > 0 &&
        product.availableStock < threshold;
    }

    if (stockStatus === 'in-stock') {
      return threshold === null ||
        product.availableStock > threshold;
    }

    return true;
  });

  // Apply sorting based on sortBy parameter
  let sortedProducts = [...filteredProducts];

  if (sortBy) {
    switch (sortBy) {
      case "name-asc":
        sortedProducts.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        break;
      case "name-desc":
        sortedProducts.sort((a, b) => b.name.toLowerCase().localeCompare(a.name.toLowerCase()));
        break;
      case "newest":
        sortedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        sortedProducts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "lowest-stock":
        sortedProducts.sort((a, b) => a.availableStock - b.availableStock);
        break;
      case "highest-stock":
        sortedProducts.sort((a, b) => b.availableStock - a.availableStock);
        break;
      case "latest-update":
        sortedProducts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case "category":
        sortedProducts.sort((a, b) => {
          const categoryA = a.category?.displayName || "";
          const categoryB = b.category?.displayName || "";
          if (categoryA === categoryB) {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
          }
          return categoryA.localeCompare(categoryB);
        });
        break;
      default:
        // Default to name ascending if sortBy is not recognized
        sortedProducts.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    }
  }



  // Generate Excel workbook
  const workbook = XLSX.utils.book_new();

  // Prepare data for Excel
  const excelData = sortedProducts.map(product => {
    const stockQuantity = product.availableStock;
    const lowThreshold = product.minStockThreshold || 0;
    const computedStockStatus = stockQuantity === 0
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
      'Product Name': product.name,
      'Product Image': imageUrl ? imageUrl : 'No Image',
      'SKU': product.sku,
      'Category': product.category?.displayName || 'Uncategorized',
      ...(client ? {} : { 'Companies': product.companies.map(c => c.name).join(', ') }),
      'Stock Quantity': stockQuantity,
      ...(client ? {} : { 'Low Stock Threshold': lowThreshold }),
      ...(client && client.isShowPrice ? {
        'Unit Price': product.price || 0,
        'Stock Value': stockValue
      } : {}),
      'Stock Status': computedStockStatus,
      ...(client ? {} : { 'Brand': product.brand || '' }),
      'Created Date': new Date(product.createdAt).toLocaleDateString('en-GB'),
      'Last Updated': new Date(product.updatedAt).toLocaleDateString('en-GB')
    };
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Add hyperlinks to the Product Image column (Column C)
  const headers = Object.keys(excelData[0]);
  const imageColIndex = headers.indexOf('Product Image');

  if (imageColIndex !== -1) {
    excelData.forEach((_, index) => {
      const product = sortedProducts[index];

      let imageUrl = '';
      if (Array.isArray(product.images)) {
        imageUrl = product.images[0] || '';
      } else if (typeof product.images === 'string') {
        imageUrl = product.images;
      }

      if (!imageUrl) return;

      const colLetter = colToLetter(imageColIndex);
      const cellAddress = `${colLetter}${index + 2}`;

      worksheet[cellAddress] = {
        t: 's',
        v: 'View Image',
        l: {
          Target: imageUrl,
          Tooltip: 'Click to view product image'
        }
      };
    });
  }


  // Set column widths for better readability
  const columnWidths = [
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

    console.log("Sesion isShowPrice:", client?.isShowPrice);
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
          ${client ? (client.isShowPrice ? (console.log("Generating price"), `<th>Price</th>`) : '') : `<th>Price</th>`}
        </tr>
      </thead>
      <tbody>
        ${sortedProducts.map(p => `
          <tr>
            <td><img src="${Array.isArray(p.images) ? p.images[0] : ''}" /></td>
            <td>${p.name}</td>
            <td>${p.sku}</td>
            <td>${p.availableStock}</td>
            ${client ? (client.isShowPrice ? `<td>${p.price}</td>` : '') : `<td>${p.price}</td>`}
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
      const html = generateInventoryHTML(sortedProducts);

      const puppeteer = await import("puppeteer-core");
      let executablePath: string;
      let browserArgs: string[];

      // Separate logic for production and development
      if (process.env.NODE_ENV === 'production') {
        const chromium = (await import('@sparticuz/chromium-min')).default;

        // Download and get Chromium executable path for production
        executablePath = await chromium.executablePath(
          'https://mf4mefwxnbqrp4a6.public.blob.vercel-storage.com/chromium-pack.tar'
        );
        browserArgs = chromium.args;
      } else {
        executablePath = getLocalChromePath();
        browserArgs = [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ];
      }

      const browser = await puppeteer.launch({
        args: browserArgs,
        executablePath: executablePath,
        headless: true,
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

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

      await browser.close();

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

  return new NextResponse(excelBuffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}