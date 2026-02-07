
// import { NextResponse } from "next/server";
// import puppeteer from "puppeteer";
// import fs from "fs";
// import path from "path";


// const logoPath = path.join(process.cwd(), "public", "logo_black.png");
// const logoBase64 = fs.readFileSync(logoPath).toString("base64");



// function getInvoiceHTML(data: any) {
//   const {
//     invoiceNumber,
//     invoiceDate,
//     seller,
//     buyer,
//     dispatch,
//     items,
//     totals,
//     notes,
//   } = data;

//   // Calculate amount in words
//   const numberToWords = (num: number): string => {
//     const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//     const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
//     const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

//     if (num === 0) return 'Zero';
    
//     const convertLessThanThousand = (n: number): string => {
//       if (n === 0) return '';
//       if (n < 10) return ones[n];
//       if (n < 20) return teens[n - 10];
//       if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
//       return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
//     };

//     if (num < 1000) return convertLessThanThousand(num);
//     if (num < 100000) {
//       return convertLessThanThousand(Math.floor(num / 1000)) + ' Thousand' + 
//         (num % 1000 !== 0 ? ' ' + convertLessThanThousand(num % 1000) : '');
//     }
//     if (num < 10000000) {
//       return convertLessThanThousand(Math.floor(num / 100000)) + ' Lakh' + 
//         (num % 100000 !== 0 ? ' ' + numberToWords(num % 100000) : '');
//     }
//     return convertLessThanThousand(Math.floor(num / 10000000)) + ' Crore' + 
//       (num % 10000000 !== 0 ? ' ' + numberToWords(num % 10000000) : '');
//   };

//   const amountInWords = numberToWords(Math.floor(totals.grand)) + ' Only';

//   return `
// <!DOCTYPE html>
// <html>
// <head>
// <meta charset="UTF-8" />
// <style>
//   * { margin: 0; padding: 0; box-sizing: border-box; }
//   body { 
//     font-family: Arial, sans-serif; 
//     font-size: 10px; 
//     padding: 20px;
//   }
//   table { 
//     width: 100%; 
//     border-collapse: collapse; 
//     margin-bottom: 0;
//   }
//   td, th { 
//     border: 1px solid #000; 
//     padding: 4px 6px; 
//     vertical-align: top; 
//     font-size: 9px;
//   }
//   .outer-border {
//     border: 2px solid #000;
//     padding: 0;
//   }
//   .no-border { border: none; }
//   .center { text-align: center; }
//   .right { text-align: right; }
//   .bold { font-weight: bold; }
//   .title { 
//     font-size: 24px; 
//     font-weight: bold; 
//     text-align: center; 
//     padding: 10px 0 5px 0;
//     letter-spacing: 2px;
//   }
//   .sub { 
//     font-size: 11px; 
//     text-align: center; 
//     padding-bottom: 10px;
//     font-weight: bold;
//   }
//   .small-text { font-size: 8px; }
//   .header-right { 
//     text-align: right; 
//     font-size: 9px;
//     padding-bottom: 3px;
//   }
//   .section-label {
//     font-weight: bold;
//     font-size: 9px;
//     padding-bottom: 2px;
//   }
//   .items-table th {
//     background-color: #f0f0f0;
//     font-weight: bold;
//     text-align: center;
//     padding: 5px 3px;
//     font-size: 8px;
//   }
//   .items-table td {
//     padding: 4px 3px;
//     font-size: 9px;
//   }
//   .amount-section {
//     border-top: none;
//   }
//   .signature-section {
//     min-height: 80px;
//   }
//   .jurisdiction {
//     text-align: center;
//     font-weight: bold;
//     padding: 8px 0;
//     font-size: 9px;
//   }
// </style>
// </head>

// <body>

// <div class="outer-border">

// <!-- Header -->
// <div style="text-align: center; padding: 10px 0;">
//   <img
//     src="data:image/png;base64,${logoBase64}"
//     alt="FITPLAY"
//     style="height: 40px;"
//   />
// </div>

// <div class="sub">TAX INVOICE</div>
// <div class="header-right" style="padding-right: 10px;">ORIGINAL FOR BUYER</div>

// <!-- Seller and Invoice Details -->
// <table style="margin-bottom: 0;">
// <tr>
// <td style="width: 60%; padding: 8px;">
//   <div class="section-label">Seller:</div>
//   <div style="font-weight: bold;">FITPLAY INTERNATIONAL LLP</div>
//   <div>B4/1002, 10th Floor,</div>
//   <div>Tulip Orange, Gurgaon</div>
//   <div>Haryana-122001</div>
//   <div style="padding-top: 4px;">GSTIN: <span style="padding-left: 100px;">06AAGFF7116E1ZQ</span></div>
//   <div>State Name: <span style="padding-left: 85px;">HARYANA</span></div>
//   <div>Email: <span style="padding-left: 110px;">accounts@fitplaysolutions.com</span></div>
// </td>

// <td style="width: 40%; padding: 8px;">
//   <table style="border: none; margin: 0;">
//     <tr>
//       <td style="border: none; border-bottom: 1px solid #000; padding: 3px; font-weight: bold;">Invoice No.</td>
//       <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px; font-weight: bold;">Dated</td>
//     </tr>
//     <tr>
//       <td style="border: none; border-bottom: 1px solid #000; padding: 3px;">${invoiceNumber}</td>
//       <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px;">${invoiceDate}</td>
//     </tr>
//     <tr>
//       <td style="border: none; border-bottom: 1px solid #000; padding: 3px; font-weight: bold;">Delivery Note</td>
//       <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px; font-weight: bold;">Mode/Terms of Payment</td>
//     </tr>
//     <tr>
//       <td style="border: none; border-bottom: 1px solid #000; padding: 3px;">${dispatch.deliveryNote || ''}</td>
//       <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px;">${dispatch.paymentTerms || ''}</td>
//     </tr>
//     <tr>
//       <td style="border: none; border-bottom: 1px solid #000; padding: 3px; font-weight: bold;">Supplier's Ref.</td>
//       <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px; font-weight: bold;">Other Ref.</td>
//     </tr>
//     <tr>
//       <td style="border: none; border-bottom: 1px solid #000; padding: 3px;">${dispatch.supplierRef || ''}</td>
//       <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px;">${dispatch.otherRef || ''}</td>
//     </tr>
//     <tr>
//       <td style="border: none; border-bottom: 1px solid #000; padding: 3px; font-weight: bold;">Buyer's Order No.</td>
//       <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px; font-weight: bold;">Dated</td>
//     </tr>
//     <tr>
//       <td style="border: none; border-bottom: 1px solid #000; padding: 3px;">${dispatch.buyerOrderNo || ''}</td>
//       <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px;">${dispatch.buyerOrderDate || ''}</td>
//     </tr>
//     <tr>
//       <td style="border: none; border-bottom: 1px solid #000; padding: 3px; font-weight: bold;">Dispatch Document No.</td>
//       <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px; font-weight: bold;">Delivery Note Date</td>
//     </tr>
//     <tr>
//       <td style="border: none; border-bottom: 1px solid #000; padding: 3px;">${dispatch.dispatchDocNo || ''}</td>
//       <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px;">${dispatch.deliveryNoteDate || ''}</td>
//     </tr>
//     <tr>
//       <td style="border: none; padding: 3px; font-weight: bold;">Dispatched Through</td>
//       <td style="border: none; border-left: 1px solid #000; padding: 3px; font-weight: bold;">Destination</td>
//     </tr>
//     <tr>
//       <td style="border: none; padding: 3px;">${dispatch.dispatchedThrough || ''}</td>
//       <td style="border: none; border-left: 1px solid #000; padding: 3px;">${dispatch.destination || ''}</td>
//     </tr>
//   </table>
// </td>
// </tr>
// </table>

// <!-- Buyer Details -->
// <table style="margin-bottom: 0;">
// <tr>
// <td style="width: 60%; padding: 8px;">
//   <div class="section-label">Buyer:</div>
//   <div style="font-weight: bold;">${buyer.name}</div>
//   <div>${buyer.address}</div>
//   <div style="padding-top: 4px;">GSTIN/UIN: <span style="padding-left: 80px;">${buyer.gstin || ''}</span></div>
//   <div>State Name: <span style="padding-left: 75px;">${dispatch.destination || ''}</span></div>
//   <div>Place of Supply: <span style="padding-left: 60px;">${dispatch.destination || ''}</span></div>
// </td>
// <td style="width: 40%; padding: 8px;">
//   <div class="section-label">Delivery Address</div>
//   <div>${dispatch.deliveryAddress }</div>
// </td>
// </tr>
// </table>

// <!-- Items Table -->
// <table class="items-table" style="margin-bottom: 0;">
// <thead>
// <tr>
//   <th style="width: 4%;">S.No.</th>
//   <th style="width: 28%;">Particulars</th>
//   <th style="width: 7%;">HSN</th>
//   <th style="width: 6%;">Qty</th>
//   <th style="width: 8%;">Price/Unit</th>
//   <th style="width: 8%;">per</th>
//   <th style="width: 8%;">Tax Rate</th>
//   <th style="width: 7%;">CGST Amt</th>
//   <th style="width: 7%;">SGST Amt</th>
//   <th style="width: 7%;">IGST Amt</th>
//   <th style="width: 10%;">Taxable Value</th>
// </tr>
// </thead>
// <tbody>
// ${items
//   .map(
//     (item: any, i: number) => `
// <tr>
//   <td class="center">${i + 1}</td>
//   <td>${item.name}</td>
//   <td class="center">${item.hsn || '3923'}</td>
//   <td class="center">${item.qty}</td>
//   <td class="right">${item.rate.toFixed(2)}</td>
//   <td class="center">-</td>
//   <td class="center">${item.taxPercent}%</td>
//   <td class="right">0.00</td>
//   <td class="right">0.00</td>
//   <td class="right">${(item.igst / item.qty).toFixed(2)}</td>
//   <td class="right">${item.total.toFixed(2)}</td>
// </tr>
// `
//   )
//   .join("")}

// <!-- Empty rows to match template -->
// ${Array(Math.max(0, 6 - items.length))
//   .fill(0)
//   .map(
//     () => `
// <tr>
//   <td>&nbsp;</td>
//   <td>&nbsp;</td>
//   <td>&nbsp;</td>
//   <td>&nbsp;</td>
//   <td>&nbsp;</td>
//   <td>&nbsp;</td>
//   <td>&nbsp;</td>
//   <td>&nbsp;</td>
//   <td>&nbsp;</td>
//   <td>&nbsp;</td>
//   <td>&nbsp;</td>
// </tr>
// `
//   )
//   .join("")}
// </tbody>
// </table>

// <!-- Totals -->
// <table style="margin-bottom: 0;">
// <tr>
//   <td colspan="9" class="right bold" style="width: 80%; padding: 6px;">TOTAL TAXABLE VALUE</td>
//   <td class="right" style="width: 20%; padding: 6px;">${totals.taxable.toFixed(2)}</td>
// </tr>
// <tr>
//   <td colspan="9" class="right bold" style="padding: 6px;">CGST AMOUNT</td>
//   <td class="right" style="padding: 6px;">-</td>
// </tr>
// <tr>
//   <td colspan="9" class="right bold" style="padding: 6px;">SGST AMOUNT</td>
//   <td class="right" style="padding: 6px;">-</td>
// </tr>
// <tr>
//   <td colspan="9" class="right bold" style="padding: 6px;">IGST AMOUNT</td>
//   <td class="right" style="padding: 6px;">${totals.igst.toFixed(2)}</td>
// </tr>
// <tr>
//   <td colspan="9" class="right bold" style="padding: 6px;">TOTAL TAX AMOUNT</td>
//   <td class="right" style="padding: 6px;">${totals.igst.toFixed(2)}</td>
// </tr>
// <tr>
//   <td colspan="9" class="right bold" style="padding: 6px; font-size: 11px;">GRAND TOTAL</td>
//   <td class="right bold" style="padding: 6px; font-size: 11px;">${totals.grand.toFixed(2)}</td>
// </tr>
// </table>

// <!-- Amount in Words -->
// <table style="margin-bottom: 0;">
// <tr>
//   <td style="padding: 6px;">
//     <span class="bold">Amount in Words:</span><br/>
//     <span class="bold">Rupees ${amountInWords}</span>
//   </td>
// </tr>
// <tr>
//   <td style="padding: 6px;">
//     <span class="bold">Tax Amount in Words:</span><br/>
//     <span class="bold">Rupees ${numberToWords(Math.floor(totals.igst))} Only</span>
//   </td>
// </tr>
// </table>

// <!-- Bank Details and Signature -->
// <table style="margin-bottom: 0;">
// <tr>
// <td style="width: 60%; padding: 8px;">
//   <div class="bold">Company's Bank Details:</div>
//   <div>Bank Name: <span style="padding-left: 60px;">SBI BANK</span></div>
//   <div>A/c No: <span style="padding-left: 80px;">43255749616</span></div>
//   <div>Branch & IFSC Code: <span style="padding-left: 15px;">SME MG Road Gurgaon & SBIN0004402</span></div>
//   <div>Branch Code: <span style="padding-left: 15px;">4402</span></div>
//    <div>Swift Code: <span style="padding-left: 15px;"></span></div>
  
//   <div>Company's PAN: <span style="padding-left: 38px;">AAGFF7116E</span></div>
//   <div style="padding-top: 8px; font-size: 8px; font-style: italic;">
//     We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
//   </div>
// </td>

// <td style="width: 40%; padding: 8px;" class="signature-section">
//   <div class="center bold" style="padding-top: 10px;">For FITPLAY INTERNATIONAL LLP</div>
//   <div class="center" style="padding-top: 40px; font-weight: bold;">Authorized Signatory</div>
// </td>
// </tr>
// </table>

// <!-- Jurisdiction -->
// <div class="jurisdiction">
// SUBJECT TO HARYANA JURISDICTION
// </div>

// </div>

// </body>
// </html>
// `;
// }


// export async function POST(req: Request) {
//   try {
//     const data = await req.json();

//     const browser = await puppeteer.launch({
//       headless: "new",
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();

//     const html = getInvoiceHTML(data);

//     await page.setContent(html, { waitUntil: "networkidle0" });

//     const pdf = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       margin: {
//         top: "20px",
//         bottom: "20px",
//         left: "20px",
//         right: "20px",
//       },
//     });

//     await browser.close();

//     return new NextResponse(pdf, {
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename=invoice-${data.invoiceNumber}.pdf`,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to generate invoice" },
//       { status: 500 }
//     );
//   }
// }







import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium-min";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";

const logoPath = path.join(process.cwd(), "public", "logo_black.png");
const logoBase64 = fs.readFileSync(logoPath).toString("base64");

function getInvoiceHTML(data: any) {
  const {
    invoiceNumber,
    invoiceDate,
    seller,
    buyer,
    dispatch,
    items,
    totals,
    notes,
  } = data;

  // Calculate amount in words
  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num === 0) return 'Zero';
    
    const convertLessThanThousand = (n: number): string => {
      if (n === 0) return '';
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
      return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
    };

    if (num < 1000) return convertLessThanThousand(num);
    if (num < 100000) {
      return convertLessThanThousand(Math.floor(num / 1000)) + ' Thousand' + 
        (num % 1000 !== 0 ? ' ' + convertLessThanThousand(num % 1000) : '');
    }
    if (num < 10000000) {
      return convertLessThanThousand(Math.floor(num / 100000)) + ' Lakh' + 
        (num % 100000 !== 0 ? ' ' + numberToWords(num % 100000) : '');
    }
    return convertLessThanThousand(Math.floor(num / 10000000)) + ' Crore' + 
      (num % 10000000 !== 0 ? ' ' + numberToWords(num % 10000000) : '');
  };

  const amountInWords = numberToWords(Math.floor(totals.grand)) + ' Only';

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    font-family: Arial, sans-serif; 
    font-size: 10px; 
    padding: 20px;
  }
  table { 
    width: 100%; 
    border-collapse: collapse; 
    margin-bottom: 0;
  }
  td, th { 
    border: 1px solid #000; 
    padding: 4px 6px; 
    vertical-align: top; 
    font-size: 9px;
  }
  .outer-border {
    border: 2px solid #000;
    padding: 0;
  }
  .no-border { border: none; }
  .center { text-align: center; }
  .right { text-align: right; }
  .bold { font-weight: bold; }
  .title { 
    font-size: 24px; 
    font-weight: bold; 
    text-align: center; 
    padding: 10px 0 5px 0;
    letter-spacing: 2px;
  }
  .sub { 
    font-size: 11px; 
    text-align: center; 
    padding-bottom: 10px;
    font-weight: bold;
  }
  .small-text { font-size: 8px; }
  .header-right { 
    text-align: right; 
    font-size: 9px;
    padding-bottom: 3px;
  }
  .section-label {
    font-weight: bold;
    font-size: 9px;
    padding-bottom: 2px;
  }
  .items-table th {
    background-color: #f0f0f0;
    font-weight: bold;
    text-align: center;
    padding: 5px 3px;
    font-size: 8px;
  }
  .items-table td {
    padding: 4px 3px;
    font-size: 9px;
  }
  .amount-section {
    border-top: none;
  }
  .signature-section {
    min-height: 80px;
  }
  .jurisdiction {
    text-align: center;
    font-weight: bold;
    padding: 8px 0;
    font-size: 9px;
  }
</style>
</head>

<body>

<div class="outer-border">

<!-- Header -->
<div style="text-align: center; padding: 10px 0;">
  <img
    src="data:image/png;base64,${logoBase64}"
    alt="FITPLAY"
    style="height: 40px;"
  />
</div>

<div class="sub">TAX INVOICE</div>
<div class="header-right" style="padding-right: 10px;">ORIGINAL FOR BUYER</div>

<!-- Seller and Invoice Details -->
<table style="margin-bottom: 0;">
<tr>
<td style="width: 60%; padding: 8px;">
  <div class="section-label">Seller:</div>
  <div style="font-weight: bold;">FITPLAY INTERNATIONAL LLP</div>
  <div>B4/1002, 10th Floor,</div>
  <div>Tulip Orange, Gurgaon</div>
  <div>Haryana-122001</div>
  <div style="padding-top: 4px;">GSTIN: <span style="padding-left: 100px;">06AAGFF7116E1ZQ</span></div>
  <div>State Name: <span style="padding-left: 85px;">HARYANA</span></div>
  <div>Email: <span style="padding-left: 110px;">accounts@fitplaysolutions.com</span></div>
</td>

<td style="width: 40%; padding: 8px;">
  <table style="border: none; margin: 0;">
    <tr>
      <td style="border: none; border-bottom: 1px solid #000; padding: 3px; font-weight: bold;">Invoice No.</td>
      <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px; font-weight: bold;">Dated</td>
    </tr>
    <tr>
      <td style="border: none; border-bottom: 1px solid #000; padding: 3px;">${invoiceNumber}</td>
      <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px;">${invoiceDate}</td>
    </tr>
    <tr>
      <td style="border: none; border-bottom: 1px solid #000; padding: 3px; font-weight: bold;">Delivery Note</td>
      <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px; font-weight: bold;">Mode/Terms of Payment</td>
    </tr>
    <tr>
      <td style="border: none; border-bottom: 1px solid #000; padding: 3px;">${dispatch.deliveryNote || ''}</td>
      <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px;">${dispatch.paymentTerms || ''}</td>
    </tr>
    <tr>
      <td style="border: none; border-bottom: 1px solid #000; padding: 3px; font-weight: bold;">Supplier's Ref.</td>
      <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px; font-weight: bold;">Other Ref.</td>
    </tr>
    <tr>
      <td style="border: none; border-bottom: 1px solid #000; padding: 3px;">${dispatch.supplierRef || ''}</td>
      <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px;">${dispatch.otherRef || ''}</td>
    </tr>
    <tr>
      <td style="border: none; border-bottom: 1px solid #000; padding: 3px; font-weight: bold;">Buyer's Order No.</td>
      <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px; font-weight: bold;">Dated</td>
    </tr>
    <tr>
      <td style="border: none; border-bottom: 1px solid #000; padding: 3px;">${dispatch.buyerOrderNo || ''}</td>
      <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px;">${dispatch.buyerOrderDate || ''}</td>
    </tr>
    <tr>
      <td style="border: none; border-bottom: 1px solid #000; padding: 3px; font-weight: bold;">Dispatch Document No.</td>
      <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px; font-weight: bold;">Delivery Note Date</td>
    </tr>
    <tr>
      <td style="border: none; border-bottom: 1px solid #000; padding: 3px;">${dispatch.dispatchDocNo || ''}</td>
      <td style="border: none; border-bottom: 1px solid #000; border-left: 1px solid #000; padding: 3px;">${dispatch.deliveryNoteDate || ''}</td>
    </tr>
    <tr>
      <td style="border: none; padding: 3px; font-weight: bold;">Dispatched Through</td>
      <td style="border: none; border-left: 1px solid #000; padding: 3px; font-weight: bold;">Destination</td>
    </tr>
    <tr>
      <td style="border: none; padding: 3px;">${dispatch.dispatchedThrough || ''}</td>
      <td style="border: none; border-left: 1px solid #000; padding: 3px;">${dispatch.destination || ''}</td>
    </tr>
  </table>
</td>
</tr>
</table>

<!-- Buyer Details -->
<table style="margin-bottom: 0;">
<tr>
<td style="width: 60%; padding: 8px;">
  <div class="section-label">Buyer:</div>
  <div style="font-weight: bold;">${buyer.name}</div>
  <div>${buyer.address}</div>
  <div style="padding-top: 4px;">GSTIN/UIN: <span style="padding-left: 80px;">${buyer.gstin || ''}</span></div>
  <div>State Name: <span style="padding-left: 75px;">${dispatch.destination || ''}</span></div>
  <div>Place of Supply: <span style="padding-left: 60px;">${dispatch.destination || ''}</span></div>
</td>
<td style="width: 40%; padding: 8px;">
  <div class="section-label">Delivery Address</div>
  <div>${dispatch.deliveryAddress }</div>
</td>
</tr>
</table>

<!-- Items Table -->
<table class="items-table" style="margin-bottom: 0;">
<thead>
<tr>
  <th style="width: 4%;">S.No.</th>
  <th style="width: 28%;">Particulars</th>
  <th style="width: 7%;">HSN</th>
  <th style="width: 6%;">Qty</th>
  <th style="width: 8%;">Price/Unit</th>
  <th style="width: 8%;">per</th>
  <th style="width: 8%;">Tax Rate</th>
  <th style="width: 7%;">CGST Amt</th>
  <th style="width: 7%;">SGST Amt</th>
  <th style="width: 7%;">IGST Amt</th>
  <th style="width: 10%;">Taxable Value</th>
</tr>
</thead>
<tbody>
${items
  .map(
    (item: any, i: number) => `
<tr>
  <td class="center">${i + 1}</td>
  <td>${item.name}</td>
  <td class="center">${item.hsn || '3923'}</td>
  <td class="center">${item.qty}</td>
  <td class="right">${item.rate.toFixed(2)}</td>
  <td class="center">-</td>
  <td class="center">${item.taxPercent}%</td>
  <td class="right">0.00</td>
  <td class="right">0.00</td>
  <td class="right">${(item.igst / item.qty).toFixed(2)}</td>
  <td class="right">${item.total.toFixed(2)}</td>
</tr>
`
  )
  .join("")}

<!-- Empty rows to match template -->
${Array(Math.max(0, 6 - items.length))
  .fill(0)
  .map(
    () => `
<tr>
  <td>&nbsp;</td>
  <td>&nbsp;</td>
  <td>&nbsp;</td>
  <td>&nbsp;</td>
  <td>&nbsp;</td>
  <td>&nbsp;</td>
  <td>&nbsp;</td>
  <td>&nbsp;</td>
  <td>&nbsp;</td>
  <td>&nbsp;</td>
  <td>&nbsp;</td>
</tr>
`
  )
  .join("")}
</tbody>
</table>

<!-- Totals -->
<table style="margin-bottom: 0;">
<tr>
  <td colspan="9" class="right bold" style="width: 80%; padding: 6px;">TOTAL TAXABLE VALUE</td>
  <td class="right" style="width: 20%; padding: 6px;">${totals.taxable.toFixed(2)}</td>
</tr>
<tr>
  <td colspan="9" class="right bold" style="padding: 6px;">CGST AMOUNT</td>
  <td class="right" style="padding: 6px;">-</td>
</tr>
<tr>
  <td colspan="9" class="right bold" style="padding: 6px;">SGST AMOUNT</td>
  <td class="right" style="padding: 6px;">-</td>
</tr>
<tr>
  <td colspan="9" class="right bold" style="padding: 6px;">IGST AMOUNT</td>
  <td class="right" style="padding: 6px;">${totals.igst.toFixed(2)}</td>
</tr>
<tr>
  <td colspan="9" class="right bold" style="padding: 6px;">TOTAL TAX AMOUNT</td>
  <td class="right" style="padding: 6px;">${totals.igst.toFixed(2)}</td>
</tr>
<tr>
  <td colspan="9" class="right bold" style="padding: 6px; font-size: 11px;">GRAND TOTAL</td>
  <td class="right bold" style="padding: 6px; font-size: 11px;">${totals.grand.toFixed(2)}</td>
</tr>
</table>

<!-- Amount in Words -->
<table style="margin-bottom: 0;">
<tr>
  <td style="padding: 6px;">
    <span class="bold">Amount in Words:</span><br/>
    <span class="bold">Rupees ${amountInWords}</span>
  </td>
</tr>
<tr>
  <td style="padding: 6px;">
    <span class="bold">Tax Amount in Words:</span><br/>
    <span class="bold">Rupees ${numberToWords(Math.floor(totals.igst))} Only</span>
  </td>
</tr>
</table>

<!-- Bank Details and Signature -->
<table style="margin-bottom: 0;">
<tr>
<td style="width: 60%; padding: 8px;">
  <div class="bold">Company's Bank Details:</div>
  <div>Bank Name: <span style="padding-left: 60px;">SBI BANK</span></div>
  <div>A/c No: <span style="padding-left: 80px;">43255749616</span></div>
  <div>Branch & IFSC Code: <span style="padding-left: 15px;">SME MG Road Gurgaon & SBIN0004402</span></div>
  <div>Branch Code: <span style="padding-left: 15px;">4402</span></div>
   <div>Swift Code: <span style="padding-left: 15px;"></span></div>
  
  <div>Company's PAN: <span style="padding-left: 38px;">AAGFF7116E</span></div>
  <div style="padding-top: 8px; font-size: 8px; font-style: italic;">
    We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
  </div>
</td>

<td style="width: 40%; padding: 8px;" class="signature-section">
  <div class="center bold" style="padding-top: 10px;">For FITPLAY INTERNATIONAL LLP</div>
  <div class="center" style="padding-top: 40px; font-weight: bold;">Authorized Signatory</div>
</td>
</tr>
</table>

<!-- Jurisdiction -->
<div class="jurisdiction">
SUBJECT TO HARYANA JURISDICTION
</div>

</div>

</body>
</html>
`;
}

async function getBrowser() {
  // if (process.env.VERCEL_ENV === "production") {
    return await puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(remoteExecutablePath),
      headless: true,
    });
  // } else {
  //   return await puppeteer.launch({
  //     args: ["--no-sandbox", "--disable-setuid-sandbox"],
  //     headless: true,
  //   });
  // }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const browser = await getBrowser();
    const page = await browser.newPage();

    const html = getInvoiceHTML(data);

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        bottom: "20px",
        left: "20px",
        right: "20px",
      },
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${data.invoiceNumber}.pdf`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}