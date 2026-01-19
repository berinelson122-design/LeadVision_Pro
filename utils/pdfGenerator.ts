import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { PropertyData } from '../types';

// Define interface for jsPDF with autoTable plugin
interface JsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => JsPDFWithAutoTable;
}

export const generatePDFReport = (data: PropertyData[]) => {
  const doc = new jsPDF() as unknown as JsPDFWithAutoTable;
  
  // Cyberpunk Header
  doc.setFillColor(5, 5, 5);
  doc.rect(0, 0, 210, 297, 'F');
  
  doc.setTextColor(0, 243, 255); // Cyan
  doc.setFont("courier", "bold");
  doc.setFontSize(22);
  doc.text("LEADVISION PRO // REPORT", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text(`GENERATED: ${new Date().toISOString()}`, 14, 28);
  doc.text(`TOTAL RECORDS: ${data.length}`, 14, 33);

  // Stats
  const totalValue = data.reduce((acc, curr) => acc + curr.price, 0);
  const avgPrice = totalValue / data.length;
  const distressedCount = data.filter(d => d.status === 'AUCTION' || d.status === 'FORECLOSURE').length;
  
  doc.setTextColor(255, 0, 60); // Red
  doc.text(`DISTRESSED PROPERTIES: ${distressedCount}`, 14, 45);
  doc.setTextColor(0, 243, 255);
  doc.text(`MARKET VOLUME: $${(totalValue / 1000000).toFixed(2)}M`, 14, 50);

  // Table
  const tableData = data.map(row => [
    row.address,
    row.zip,
    `$${row.price.toLocaleString()}`,
    row.status,
    row.priceCut > 0 ? `-$${row.priceCut.toLocaleString()}` : '-'
  ]);

  doc.autoTable({
    startY: 60,
    head: [['Address', 'Zip', 'Price', 'Status', 'Cut']],
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fillColor: [0, 0, 0], 
      textColor: [0, 243, 255],
      lineWidth: 0.1,
      lineColor: [0, 243, 255]
    },
    bodyStyles: { 
      fillColor: [10, 10, 10], 
      textColor: [220, 220, 220],
      font: 'courier'
    },
    alternateRowStyles: {
      fillColor: [5, 5, 5]
    },
    margin: { top: 60 }
  });

  doc.save('leadvision_intel.pdf');
};