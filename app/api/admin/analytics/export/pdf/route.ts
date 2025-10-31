import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { hasPermission } from '@/lib/utils';
import { RESOURCES, PERMISSIONS } from '@/lib/utils';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * GET /api/admin/analytics/export/pdf
 * Export analytics data as PDF
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🚀 PDF Export API called:', request.url);
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

    console.log('📊 PDF Export parameters:', {
      exportType,
      dateFrom,
      dateTo,
      clientId,
      companyId,
      status
    });

    if (exportType === 'orders') {
      console.log('📦 Exporting orders data as PDF...');
      return await exportOrdersPDF(dateFrom, dateTo, clientId, companyId, status);
    } else if (exportType === 'inventory') {
      console.log('📋 Exporting inventory data as PDF...');
      return await exportInventoryPDF(companyId);
    } else {
      console.log('❌ Invalid export type:', exportType);
      return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    }

  } catch (error) {
    console.error('Analytics PDF Export API Error:', error);
    return NextResponse.json(
      { error: 'Failed to export PDF analytics data' }, 
      { status: 500 }
    );
  }
}

/**
 * Export orders data as PDF
 */
async function exportOrdersPDF(
  dateFrom: string | null, 
  dateTo: string | null, 
  clientId: string | null, 
  companyId: string | null, 
  status: string | null
) {
  console.log('📦 Starting orders PDF export with filters:', { dateFrom, dateTo, clientId, companyId, status });
  
  // Build date filter
  const dateFilter: Record<string, Date> = {};
  if (dateFrom) {
    dateFilter.gte = new Date(dateFrom);
  }
  if (dateTo) {
    dateFilter.lte = new Date(dateTo);
  }

  // Build order filters
  const orderFilters: Record<string, any> = {};
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
    orderBy: { createdAt: 'desc' },
    take: 50 // Limit for PDF readability
  });

  console.log('📊 Orders found for PDF export:', orders.length);

  // Create PDF document
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Add first page
  let page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  let yPosition = 800;
  const margin = 50;
  const lineHeight = 15;

  // Header
  page.drawText('Orders Export Report', {
    x: margin,
    y: yPosition,
    size: 20,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  yPosition -= 30;
  page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, {
    x: margin,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });

  yPosition -= 30;
  page.drawText(`Total Orders: ${orders.length}`, {
    x: margin,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  yPosition -= 40;

  // Orders data
  for (const order of orders) {
    // Check if we need a new page
    if (yPosition < 100) {
      page = pdfDoc.addPage([595.28, 841.89]);
      yPosition = 800;
    }

    // Build complete shipping address
    const addressParts = [
      order.deliveryAddress,
      order.city,
      order.state,
      order.pincode
    ].filter(part => part && part !== 'Address' && part !== 'City' && part !== 'State' && part !== '000000');
    
    const fullShippingAddress = addressParts.length > 0 ? addressParts.join(', ') : 'Address not provided';

    // Order header
    page.drawText(`Order #${order.id.slice(-8)}`, {
      x: margin,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    yPosition -= lineHeight;
    page.drawText(`Client: ${order.client?.name || 'N/A'} | Status: ${order.status}`, {
      x: margin,
      y: yPosition,
      size: 10,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= lineHeight;
    page.drawText(`Amount: Rs.${order.totalAmount || 0} | Date: ${new Date(order.createdAt).toLocaleDateString()}`, {
      x: margin,
      y: yPosition,
      size: 10,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= lineHeight;
    page.drawText(`Shipping: ${fullShippingAddress}`, {
      x: margin,
      y: yPosition,
      size: 10,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    // Items
    if (order.orderItems && order.orderItems.length > 0) {
      yPosition -= lineHeight;
      page.drawText('Items:', {
        x: margin + 10,
        y: yPosition,
        size: 10,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2),
      });

      for (const item of order.orderItems) {
        yPosition -= lineHeight;
        if (yPosition < 100) {
          page = pdfDoc.addPage([595.28, 841.89]);
          yPosition = 800;
        }
        
        page.drawText(`• ${item.product?.name || 'Unknown'} - Qty: ${item.quantity}, Price: Rs.${item.price}`, {
          x: margin + 20,
          y: yPosition,
          size: 9,
          font: font,
          color: rgb(0.3, 0.3, 0.3),
        });
      }
    }

    yPosition -= 25; // Space between orders
  }

  // Generate PDF bytes
  const pdfBytes = await pdfDoc.save();
  const filename = `orders_export_${new Date().toISOString().split('T')[0]}.pdf`;

  console.log('📋 PDF generated, orders:', orders.length, 'filename:', filename);

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

/**
 * Export inventory data as PDF
 */
async function exportInventoryPDF(companyId: string | null) {
  console.log('📋 Starting inventory PDF export with companyId:', companyId);
  
  const inventoryFilters: Record<string, any> = {};
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
    orderBy: { name: 'asc' },
    take: 100 // Limit for PDF readability
  });

  // Create PDF document
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Add first page
  let page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  let yPosition = 800;
  const margin = 50;
  const lineHeight = 15;

  // Header
  page.drawText('Inventory Export Report', {
    x: margin,
    y: yPosition,
    size: 20,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  yPosition -= 30;
  page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, {
    x: margin,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });

  yPosition -= 30;
  page.drawText(`Total Products: ${products.length}`, {
    x: margin,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  yPosition -= 40;

  // Products data
  for (const product of products) {
    // Check if we need a new page
    if (yPosition < 100) {
      page = pdfDoc.addPage([595.28, 841.89]);
      yPosition = 800;
    }

    const stockQuantity = product.availableStock;
    const lowThreshold = 10;
    const stockStatus = stockQuantity === 0 
      ? 'Out of Stock' 
      : stockQuantity <= lowThreshold
      ? 'Low Stock'
      : 'In Stock';
    
    const stockValue = stockQuantity * (product.price || 0);

    // Product header
    page.drawText(`${product.name}`, {
      x: margin,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    yPosition -= lineHeight;
    page.drawText(`SKU: ${product.sku || 'N/A'} | Category: ${product.categories || 'Uncategorized'}`, {
      x: margin,
      y: yPosition,
      size: 10,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= lineHeight;
    page.drawText(`Stock: ${stockQuantity} | Status: ${stockStatus} | Price: Rs.${product.price || 0}`, {
      x: margin,
      y: yPosition,
      size: 10,
      font: font,
      color: stockStatus === 'Out of Stock' ? rgb(0.8, 0, 0) : stockStatus === 'Low Stock' ? rgb(0.8, 0.5, 0) : rgb(0, 0.6, 0),
    });

    yPosition -= lineHeight;
    page.drawText(`Value: Rs.${stockValue.toFixed(2)} | Companies: ${product.companies.map(c => c.name).join(', ')}`, {
      x: margin,
      y: yPosition,
      size: 10,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= 25; // Space between products
  }

  // Generate PDF bytes
  const pdfBytes = await pdfDoc.save();
  const filename = `inventory_export_${new Date().toISOString().split('T')[0]}.pdf`;

  console.log('📋 PDF generated, products:', products.length, 'filename:', filename);

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}