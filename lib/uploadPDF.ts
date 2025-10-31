import { generateShippingLabelPDF } from "@/lib/generateShippingLabel";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function uploadShippingLabelToUploadThing(order: any) {
  // Generate the PDF buffer
  const pdfBuffer = await generateShippingLabelPDF(order);

  // Ensure we pass an ArrayBufferView (Uint8Array) so it matches BlobPart types
  const blobPart = Buffer.isBuffer(pdfBuffer) ? new Uint8Array(pdfBuffer) : pdfBuffer;

  // Upload to UploadThing via the server SDK
  const result = await utapi.uploadFiles(
    new File([blobPart], `shipping-label-${order.id}.pdf`, { type: "application/pdf" })
  );

  if (!result || !result.data?.url) {
    throw new Error("Failed to upload shipping label PDF to UploadThing");
  }

  return result.data.url; // ✅ return the hosted URL
}
