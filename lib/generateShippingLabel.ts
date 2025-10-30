import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generateShippingLabelPDF(order: any): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  
  // Load fonts
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  // Colors
  const primaryColor = rgb(0.2, 0.4, 0.8); // Professional blue
  const darkGray = rgb(0.3, 0.3, 0.3);
  const lightGray = rgb(0.9, 0.9, 0.9);
  const black = rgb(0, 0, 0);

  // Extract order data
  const { 
    consignmentNumber, 
    deliveryService,
    client: { company } = {}, 
    orderItems,
    deliveryAddress,
    city,
    state,
    pincode,
    consigneeName,
    consigneePhone,
    consigneeEmail,
    modeOfDelivery,
    id: orderId,
    createdAt
  } = order;

  // Company info
  const companyName = company?.name || "Unknown Company";
  const companyAddress = company?.address || deliveryAddress || "Address not provided";
  
  // Items list
  const itemsList = orderItems?.map((item: any) => 
    `${item.product.name} (Qty: ${item.quantity})`
  ).join(', ') || "No items";

  // Page dimensions
  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 40;

  // Draw header with company branding
  page.drawRectangle({
    x: 0,
    y: pageHeight - 120,
    width: pageWidth,
    height: 120,
    color: primaryColor,
  });

  // Company logo area (placeholder)
  page.drawRectangle({
    x: margin,
    y: pageHeight - 100,
    width: 80,
    height: 60,
    color: rgb(1, 1, 1),
  });
  page.drawText("FITPLAY", {
    x: margin + 10,
    y: pageHeight - 75,
    size: 12,
    font: boldFont,
    color: primaryColor,
  });

  // Main title
  page.drawText("SHIPPING LABEL", {
    x: margin + 120,
    y: pageHeight - 60,
    size: 24,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  // Order information
  page.drawText(`Order ID: ${orderId}`, {
    x: pageWidth - 200,
    y: pageHeight - 45,
    size: 12,
    font: regularFont,
    color: rgb(1, 1, 1),
  });

  page.drawText(`Date: ${new Date(createdAt).toLocaleDateString()}`, {
    x: pageWidth - 200,
    y: pageHeight - 65,
    size: 12,
    font: regularFont,
    color: rgb(1, 1, 1),
  });

  let currentY = pageHeight - 160;

  // TO Section with better formatting
  page.drawRectangle({
    x: margin,
    y: currentY - 5,
    width: (pageWidth - 2 * margin) / 2 - 10,
    height: 140,
    borderColor: primaryColor,
    borderWidth: 2,
  });

  page.drawText("SHIP TO:", {
    x: margin + 10,
    y: currentY - 20,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });

  // Company name
  page.drawText(companyName, {
    x: margin + 10,
    y: currentY - 45,
    size: 12,
    font: boldFont,
    color: black,
  });

  // Contact person
  page.drawText(consigneeName || "Contact Person", {
    x: margin + 10,
    y: currentY - 65,
    size: 11,
    font: regularFont,
    color: darkGray,
  });

  // Address (wrap text if too long)
  const addressLines = wrapText(companyAddress, 35);
  addressLines.forEach((line, index) => {
    page.drawText(line, {
      x: margin + 10,
      y: currentY - 85 - (index * 15),
      size: 10,
      font: regularFont,
      color: darkGray,
    });
  });

  // City, State, PIN
  page.drawText(`${city}, ${state} - ${pincode}`, {
    x: margin + 10,
    y: currentY - 125,
    size: 11,
    font: regularFont,
    color: darkGray,
  });

  // Phone and Email
  if (consigneePhone) {
    page.drawText(`Phone: ${consigneePhone}`, {
      x: margin + 10,
      y: currentY - 140,
      size: 10,
      font: regularFont,
      color: darkGray,
    });
  }

  // FROM Section
  const fromX = pageWidth / 2 + 10;
  page.drawRectangle({
    x: fromX,
    y: currentY - 5,
    width: (pageWidth - 2 * margin) / 2 - 10,
    height: 140,
    borderColor: rgb(0.6, 0.6, 0.6),
    borderWidth: 1,
  });

  page.drawText("SHIP FROM:", {
    x: fromX + 10,
    y: currentY - 20,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });

  page.drawText("Fitplay International LLP", {
    x: fromX + 10,
    y: currentY - 45,
    size: 12,
    font: boldFont,
    color: black,
  });

  // Add actual company address (you can make this configurable)
  const fitplayAddress = [
    "Plot No. 123, Industrial Area",
    "Sector 45, Gurugram",
    "Haryana - 122003, India"
  ];

  fitplayAddress.forEach((line, index) => {
    page.drawText(line, {
      x: fromX + 10,
      y: currentY - 70 - (index * 15),
      size: 10,
      font: regularFont,
      color: darkGray,
    });
  });

  page.drawText("Phone: +91-9876543210", {
    x: fromX + 10,
    y: currentY - 125,
    size: 10,
    font: regularFont,
    color: darkGray,
  });

  page.drawText("Email: shipping@fitplay.in", {
    x: fromX + 10,
    y: currentY - 140,
    size: 10,
    font: regularFont,
    color: darkGray,
  });

  currentY -= 180;

  // Shipping Details Section
  page.drawRectangle({
    x: margin,
    y: currentY - 5,
    width: pageWidth - 2 * margin,
    height: 120,
    color: lightGray,
    borderColor: primaryColor,
    borderWidth: 1,
  });

  page.drawText("SHIPPING DETAILS", {
    x: margin + 10,
    y: currentY - 25,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });

  // Two column layout for shipping details
  const leftColumn = margin + 10;
  const rightColumn = pageWidth / 2 + 10;

  if (consignmentNumber) {
    page.drawText(`Consignment Number: ${consignmentNumber}`, {
      x: leftColumn,
      y: currentY - 50,
      size: 11,
      font: boldFont,
      color: black,
    });
  }

  if (deliveryService) {
    page.drawText(`Delivery Service: ${deliveryService}`, {
      x: rightColumn,
      y: currentY - 50,
      size: 11,
      font: regularFont,
      color: black,
    });
  }

  page.drawText(`Mode: ${modeOfDelivery || 'SURFACE'}`, {
    x: leftColumn,
    y: currentY - 75,
    size: 11,
    font: regularFont,
    color: darkGray,
  });

  page.drawText(`Weight: ${orderItems?.length || 1} item(s)`, {
    x: rightColumn,
    y: currentY - 75,
    size: 11,
    font: regularFont,
    color: darkGray,
  });

  currentY -= 140;

  // Items Section
  page.drawText("ITEMS SHIPPED:", {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });

  currentY -= 25;

  // Items table header
  page.drawRectangle({
    x: margin,
    y: currentY - 5,
    width: pageWidth - 2 * margin,
    height: 25,
    color: lightGray,
  });

  page.drawText("Item Description", {
    x: margin + 10,
    y: currentY - 20,
    size: 11,
    font: boldFont,
    color: black,
  });

  page.drawText("Qty", {
    x: pageWidth - 150,
    y: currentY - 20,
    size: 11,
    font: boldFont,
    color: black,
  });

  page.drawText("SKU", {
    x: pageWidth - 100,
    y: currentY - 20,
    size: 11,
    font: boldFont,
    color: black,
  });

  currentY -= 30;

  // Items list
  orderItems?.forEach((item: any, index: number) => {
    const itemY = currentY - (index * 25);
    
    page.drawText(item.product.name, {
      x: margin + 10,
      y: itemY,
      size: 10,
      font: regularFont,
      color: black,
    });

    page.drawText(item.quantity.toString(), {
      x: pageWidth - 150,
      y: itemY,
      size: 10,
      font: regularFont,
      color: black,
    });

    page.drawText(item.product.sku || 'N/A', {
      x: pageWidth - 100,
      y: itemY,
      size: 10,
      font: regularFont,
      color: black,
    });
  });

  // Footer
  const footerY = 60;
  page.drawText("This is a computer-generated shipping label. Handle with care.", {
    x: margin,
    y: footerY,
    size: 8,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5),
  });

  page.drawText(`Generated on: ${new Date().toLocaleString()}`, {
    x: pageWidth - 200,
    y: footerY,
    size: 8,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// Helper function to wrap text
function wrapText(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + word).length <= maxChars) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) lines.push(currentLine);
  return lines;
}
