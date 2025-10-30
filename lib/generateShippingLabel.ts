import fs from "fs";
import path from "path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb } from "pdf-lib";

export async function generateShippingLabelPDF(order: any): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();

  // ✅ Enable custom fonts
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.addPage([500, 450]);

  // --- Load Roboto Mono fonts ---
  const regularFontBytes = fs.readFileSync(path.resolve("public/fonts/RobotoMono-Regular.ttf"));
  const boldFontBytes = fs.readFileSync(path.resolve("public/fonts/RobotoMono-Bold.ttf"));

  const fontRegular = await pdfDoc.embedFont(regularFontBytes);
  const fontBold = await pdfDoc.embedFont(boldFontBytes);

  const { client, client: { company } = {}, orderItems } = order;

  const companyName = company?.name || "N/A";
  const companyAddress = company?.address || "N/A";
  const pocName = client?.name || "N/A";
  const pocPhone = client?.phone || "N/A";

  const senderName = "FITPLAY INTERNATIONAL LLP";
  const senderAddress =
    "Wz-251 Shakurpur village near Gufa Mandir, New Delhi - 110034";
  const senderContact = "Sonu Kumar 9582746425";

  const pageWidth = page.getWidth();
  let y = 400;

  // --- TO Section ---
  drawCenteredText(page, "To:", fontBold, 14, y, pageWidth);
  y -= 25;
  drawCenteredText(page, companyName, fontBold, 18, y, pageWidth);
  y -= 22;
  drawCenteredText(page, companyAddress, fontRegular, 12, y, pageWidth);
  y -= 18;
  drawCenteredText(page, `${pocName} ${pocPhone}`, fontRegular, 12, y, pageWidth);

  // --- Items Section (reduced spacing) ---
  y -= 22; // half the previous 43 spacing

  if (orderItems?.length) {
    for (const item of orderItems) {
      const itemName = item.product?.name || "N/A";
      const quantity = item.quantity || 1;
      const text = `${itemName} — ${quantity}`;
      drawCenteredText(page, text, fontBold, 12, y, pageWidth);
      y -= 15; // reduced vertical spacing between items
    }
  } else {
    drawCenteredText(page, "No items found", fontRegular, 12, y, pageWidth);
    y -= 8;
  }

  // --- FROM Section ---
  y -= 20; // reduced spacing between items and 'From'
  drawCenteredText(page, "From:", fontBold, 14, y, pageWidth);
  y -= 20;
  drawCenteredText(page, senderName, fontBold, 18, y, pageWidth);
  y -= 20;
  drawCenteredText(page, senderAddress, fontRegular, 12, y, pageWidth);
  y -= 15;
  drawCenteredText(page, senderContact, fontRegular, 12, y, pageWidth);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// --- Utility: Center text ---
function drawCenteredText(page: any, text: string, font: any, size: number, y: number, pageWidth: number) {
  const textWidth = font.widthOfTextAtSize(text, size);
  const x = (pageWidth - textWidth) / 2;
  page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });
}
