import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generateShippingLabelPDF(order: any): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 300]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { consignmentNumber, client: { company } = {}, orderItems } = order;

  const companyName = company?.name || "N/A";
  const companyAddress = company?.address || "N/A";
  const pocContact = consignmentNumber || "N/A";
  const itemName = orderItems?.[0]?.product?.name || "N/A";

  page.drawText("SHIPPING LABEL", { x: 130, y: 270, size: 14, font, color: rgb(0, 0, 0) });

  // TO Section
  page.drawText("To:", { x: 30, y: 240, size: 12, font });
  page.drawText(companyName, { x: 60, y: 240, size: 12, font });
  page.drawText(companyAddress, { x: 60, y: 225, size: 12, font });
  page.drawText(`POC: ${pocContact}`, { x: 60, y: 210, size: 12, font });

  // Item Section
  page.drawText("Item:", { x: 30, y: 185, size: 12, font });
  page.drawText(itemName, { x: 60, y: 185, size: 12, font });

  // FROM Section
  page.drawText("From:", { x: 30, y: 160, size: 12, font });
  page.drawText("Fitplay International LLP", { x: 60, y: 160, size: 12, font });
  page.drawText("Address: [Your company address]", { x: 60, y: 145, size: 12, font });
  page.drawText("POC: +91-XXXXXXXXXX", { x: 60, y: 130, size: 12, font });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
