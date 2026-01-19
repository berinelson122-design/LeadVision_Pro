import { PropertyData } from '../types';

export const parseCSV = (content: string): PropertyData[] => {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const data: PropertyData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length < headers.length) continue;

    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    // Map CSV columns to PropertyData interface with fallbacks
    const price = parseFloat(row.price) || 0;
    const sqft = parseFloat(row.sqft) || 0;
    
    data.push({
      id: `prop-${i}-${Date.now()}`,
      address: row.address || 'Unknown Address',
      zip: row.zip || '00000',
      price: price,
      sqft: sqft,
      status: (row.status?.toUpperCase() as any) || 'STANDARD',
      priceCut: parseFloat(row.price_cut) || 0,
      dateListed: row.date || new Date().toISOString().split('T')[0],
      pricePerSqFt: sqft > 0 ? parseFloat((price / sqft).toFixed(2)) : 0
    });
  }

  return data;
};

export const generateDemoData = (): PropertyData[] => {
  const zips = ['90210', '10001', '33139', '94103', '60611'];
  const statuses = ['STANDARD', 'AUCTION', 'FORECLOSURE', 'STANDARD', 'STANDARD'];
  const data: PropertyData[] = [];
  
  for (let i = 0; i < 50; i++) {
    const zip = zips[Math.floor(Math.random() * zips.length)];
    const sqft = Math.floor(Math.random() * 3000) + 800;
    const price = sqft * (Math.floor(Math.random() * 500) + 200);
    const status = statuses[Math.floor(Math.random() * statuses.length)] as any;
    const isDistressed = status !== 'STANDARD';
    const priceCut = isDistressed ? Math.floor(price * 0.15) : (Math.random() > 0.7 ? Math.floor(price * 0.05) : 0);
    
    // Generate a date within the last 6 months
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 180));

    data.push({
      id: `demo-${i}`,
      address: `${Math.floor(Math.random() * 9999)} Cyber Ave`,
      zip,
      price,
      sqft,
      status,
      priceCut,
      dateListed: date.toISOString().split('T')[0],
      pricePerSqFt: parseFloat((price / sqft).toFixed(2))
    });
  }
  return data;
};