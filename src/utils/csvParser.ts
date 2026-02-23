import { PropertyData } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const parseCSV = (csvText: string): PropertyData[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    // Extract Headers (Remove quotes and whitespace)
    const headers = lines[0].split(',').map(h => h.replace(/['"]+/g, '').trim());

    const data: PropertyData[] = [];

    for (let i = 1; i < lines.length; i++) {
        // Handle CSV lines that might have commas inside quotes (e.g. "$120,000")
        // Regex: Match quoted strings OR unquoted values
        const matches = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

        if (!matches) continue;

        // Map matches to header indices
        const row: any = {};
        matches.forEach((val, idx) => {
            if (headers[idx]) {
                // Remove wrapping quotes if present
                row[headers[idx]] = val.replace(/^"|"$/g, '').trim();
            }
        });

        // --- PARSING LOGIC ---
        // Handle variations in your Python scraper output
        const address = row['Address'] || row['address'] || 'Unknown Sector';
        const rawPrice = row['Price'] || row['price'] || '$0';
        const status = row['Distress_Signals'] || row['Status'] || row['status'] || 'Standard';
        const url = row['URL'] || row['url'] || '#';
        const zip = address.match(/\d{5}/)?.[0] || '00000';

        // Numeric conversion (Strip $ and , and K)
        let priceNum = 0;
        try {
            let clean = rawPrice.replace(/[$,]/g, '').toUpperCase();
            if (clean.includes('K')) {
                clean = clean.replace('K', '');
                priceNum = parseFloat(clean) * 1000;
            } else {
                priceNum = parseFloat(clean);
            }
        } catch (e) {
            priceNum = 0;
        }

        data.push({
            id: generateId(),
            address,
            price: isNaN(priceNum) ? 0 : priceNum,
            priceStr: rawPrice, // Store the original string for display
            status,
            distressSignal: status,
            url,
            zip,
            sqft: 0, // Scraper doesn't get this yet
            pricePerSqft: 0,
            dateListed: new Date().toISOString()
        });
    }

    return data;
};

// --- DEMO DATA GENERATOR ---
// Used when you click "Initialize Demo Protocol"
export const generateDemoData = (): PropertyData[] => {
    return [
        { id: '1', address: '123 Cyber St, Neo-Baltimore', price: 15000, priceStr: '$15K', status: 'AUCTION', distressSignal: 'AUCTION', url: '#', zip: '21216', sqft: 1200, pricePerSqft: 12.5, dateListed: '' },
        { id: '2', address: '404 Void Lane, Sector 7', price: 45000, priceStr: '$45,000', status: 'FORECLOSURE', distressSignal: 'FORECLOSURE', url: '#', zip: '21217', sqft: 1000, pricePerSqft: 45, dateListed: '' },
        { id: '3', address: '888 Standard Blvd', price: 120000, priceStr: '$120k', status: 'Standard', distressSignal: 'Standard', url: '#', zip: '21215', sqft: 1500, pricePerSqft: 80, dateListed: '' },
    ];
};