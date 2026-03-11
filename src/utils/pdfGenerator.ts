
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PropertyData } from '../types';

export const generatePDFReport = (data: PropertyData[]) => {
  if (!data || data.length === 0) return;

  try {
    const doc = new jsPDF();
    const timestamp = new Date().toISOString().split('T')[0];

    // 1. VOID BRANDING
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setFontSize(22);
    doc.setTextColor(224, 86, 253); // Red-Violet
    doc.text('LEADVISION // MARKET REPORT', 14, 22);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`SECTOR: CLEVELAND/BALTIMORE // DATE: ${timestamp}`, 14, 32);

    // 2. DATA PROCESSING
    const tableRows = data.map(item => [
      (item.address || 'UNKNOWN_NODE').substring(0, 30),
      item.priceStr || 'N/A',
      (item.status || 'STANDARD').toUpperCase(),
      item.zip || '00000'
    ]);

    // 3. EXPLICIT AUTOTABLE INVOCATION
    autoTable(doc, {
      startY: 45,
      head: [['ADDRESS', 'PRICE', 'SIGNAL', 'ZIP']],
      body: tableRows,
      theme: 'grid',
      styles: {
        fillColor: [10, 10, 10],
        textColor: [200, 200, 200],
        fontSize: 8,
        font: 'courier',
        lineColor: [40, 40, 40],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [30, 30, 30],
        textColor: [224, 86, 253],
        fontStyle: 'bold',
      },
      didParseCell: (dataCell) => {
        if (dataCell.section === 'body' && dataCell.column.index === 2) {
          const val = String(dataCell.cell.raw);
          if (val !== 'STANDARD') {
            dataCell.cell.styles.textColor = [255, 0, 60]; // Cyber-Red
          }
        }
      }
    });

    // 4. SIGNATURE
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text('ARCHITECT // VOID_WEAVER // ENCRYPTED_REPORT', 14, 285);
    }

    doc.save(`LEADVISION_INTEL_${timestamp}.pdf`);
    console.log("--> EXPORT_COMPLETE");

  } catch (error) {
    console.error("--> EXPORT_FAILED:", error);
    alert("CRITICAL ERROR: PDF engine failed. Check console logs.");
  }
};