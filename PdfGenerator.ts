import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PropertyData } from './types';

export const generatePDFReport = (data: PropertyData[]) => {
  const doc = new jsPDF();
  
  // -- BRANDING --
  doc.setFillColor(0, 0, 0); // Black Background
  doc.rect(0, 0, 210, 297, 'F');
  
  doc.setFontSize(22);
  doc.setTextColor(224, 86, 253); // Neon Violet
  doc.text('LEADVISION // INTELLIGENCE REPORT', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
  doc.text(`Operator: VOID_WEAVER`, 14, 35);

  // -- SUMMARY STATS --
  const totalValue = data.reduce((acc, curr) => acc + curr.price, 0);
  const distressedCount = data.filter(d => d.status !== 'Standard').length;
  
  doc.setDrawColor(255, 0, 60); // Red Border
  doc.setLineWidth(0.5);
  doc.line(14, 40, 196, 40);

  doc.text(`Total Assets Scanned: ${data.length}`, 14, 50);
  doc.setTextColor(255, 0, 60);
  doc.text(`Distressed Opportunities: ${distressedCount}`, 14, 56);
  
  // -- THE TABLE --
  const tableData = data.map(row => [
    row.address.substring(0, 25) + '...', // Truncate address for privacy/space
    row.priceStr,
    row.status,
    row.zip
  ]);

  autoTable(doc, {
    startY: 65,
    head: [['Address', 'Price', 'Signal', 'Zip Code']],
    body: tableData,
    theme: 'grid',
    styles: {
      fillColor: [10, 10, 10],
      textColor: [200, 200, 200],
      lineColor: [40, 40, 40],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [20, 20, 20],
      textColor: [224, 86, 253], // Violet Text
      fontStyle: 'bold',
      lineColor: [224, 86, 253],
      lineWidth: 0.2
    },
    alternateRowStyles: {
      fillColor: [15, 15, 15]
    }
  });

  doc.save('LeadVision_Report.pdf');
}