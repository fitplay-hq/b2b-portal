import fs from "fs";
import path from "path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb } from "pdf-lib";

export async function generateShippingLabelPDF(order: any): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.addPage([500, 450]);
  const regularFontBytes = fs.readFileSync(path.resolve("public/fonts/RobotoMono-Regular.ttf"));
  const boldFontBytes = fs.readFileSync(path.resolve("public/fonts/RobotoMono-Bold.ttf"));

  const fontRegular = await pdfDoc.embedFont(regularFontBytes);
  const fontBold = await pdfDoc.embedFont(boldFontBytes);

  const { client: { company } = {}, orderItems, deliveryAddress, city, state, pincode, consigneeName, consigneePhone } = order;

  const companyName = company?.name || "N/A";

  // ✅ Clean and normalize the address
  const deliveryAddressRaw = deliveryAddress || "N/A";
  const deliveryAddressShown = deliveryAddressRaw
    .replace(/\s*\n\s*/g, ", ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim()
    .concat(`, ${city || "N/A"}, ${state || "N/A"}, ${pincode || "N/A"}`);

  const pocName = consigneeName || "N/A";
  const pocPhone = consigneePhone || "N/A";

  const senderName = "FITPLAY INTERNATIONAL LLP";
  const senderAddress = "Wz-251 Shakurpur village near Gufa Mandir, New Delhi - 110034";
  const senderContact = "Sonu Kumar 9582746425";

  const pageWidth = page.getWidth();
  const maxTextWidth = 420;
  let y = 400;

  // --- TO Section ---
  drawCenteredText(page, "To:", fontBold, 14, y, pageWidth);
  y -= 25;
  drawCenteredText(page, companyName, fontBold, 18, y, pageWidth);
  y -= 22;

  // ✅ Wrap address in 2 lines max
  const wrappedAddress = wrapText(deliveryAddressShown, fontRegular, 12, maxTextWidth);
  const firstLine = wrappedAddress[0] || "";
  const secondLine = wrappedAddress[1] || "";

  drawCenteredText(page, firstLine, fontRegular, 12, y, pageWidth);
  y -= 14;
  drawCenteredText(page, secondLine, fontRegular, 12, y, pageWidth);
  y -= 28; // ✅ 14 for second line + 14 for one-row vertical space

  // --- Contact person ---
  drawCenteredText(page, `${pocName} ${pocPhone}`, fontRegular, 12, y, pageWidth);
  y -= 25;

  // --- ITEMS Section ---
  if (orderItems?.length) {
    for (const item of orderItems) {
      const itemName = item.product?.name || "N/A";
      const quantity = item.quantity || 1;
      const text = `${itemName} – ${quantity}`;
      const wrappedLines = wrapText(text, fontBold, 12, maxTextWidth);
      for (const line of wrappedLines.slice(0, 2)) {
        drawCenteredText(page, line, fontBold, 12, y, pageWidth);
        y -= 14;
      }
    }
  } else {
    drawCenteredText(page, "No items found", fontRegular, 12, y, pageWidth);
    y -= 12;
  }

  y -= 20;

  // --- FROM Section ---
  drawCenteredText(page, "From:", fontBold, 14, y, pageWidth);
  y -= 20;
  drawCenteredText(page, senderName, fontBold, 18, y, pageWidth);
  y -= 20;

  const wrappedSenderAddr = wrapText(senderAddress, fontRegular, 12, maxTextWidth);
  for (const line of wrappedSenderAddr.slice(0, 2)) {
    drawCenteredText(page, line, fontRegular, 12, y, pageWidth);
    y -= 14;
  }

  drawCenteredText(page, senderContact, fontRegular, 12, y - 10, pageWidth);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// --- Utility: Center text ---
function drawCenteredText(page: any, text: string, font: any, size: number, y: number, pageWidth: number) {
  const textWidth = font.widthOfTextAtSize(text, size);
  const x = (pageWidth - textWidth) / 2;
  page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });
}

// --- Utility: Wrap text ---
function wrapText(text: string, font: any, fontSize: number, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const width = font.widthOfTextAtSize(currentLine + word, fontSize);
    if (width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  }

  if (currentLine.trim()) lines.push(currentLine.trim());
  return lines;
}
