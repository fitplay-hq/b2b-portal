import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Exports data to an Excel file (XLSX format) with generous column widths.
 * @param data Array of objects to export
 * @param filename Name of the file (without extension)
 * @param sheetName Name of the worksheet (optional, defaults to "Data")
 */
export function exportToExcel(data: any[], filename: string, sheetName: string = "Data") {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Set generous column widths (e.g., 30 characters wide)
    if (data.length > 0) {
      const colWidths = Object.keys(data[0]).map(() => ({ wch: 30 }));
      worksheet["!cols"] = colWidths;
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Generate buffer and trigger download
    XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`);
    return true;
  } catch (error) {
    console.error("Excel export error:", error);
    return false;
  }
}

/**
 * Exports data to a PDF file in landscape mode with generous column widths.
 * @param data Array of objects to export
 * @param filename Name of the file (without extension)
 * @param title Title to display at the top of the PDF
 */
export function exportToPDF(data: any[], filename: string, title: string) {
  try {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    if (data.length > 0) {
      const headers = [Object.keys(data[0])];
      const rows = data.map(obj => Object.values(obj) as any[]);

      autoTable(doc, {
        startY: 35,
        head: headers,
        body: rows,
        theme: "striped",
        headStyles: { fillColor: [79, 70, 229], textColor: 255 }, // Indigo-600
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
          // You can specify individual column styles here if needed
        },
        margin: { top: 35 },
      });
    } else {
      doc.text("No data available to export.", 14, 40);
    }

    doc.save(`${filename}_${new Date().toISOString().split("T")[0]}.pdf`);
    return true;
  } catch (error) {
    console.error("PDF export error:", error);
    return false;
  }
}
