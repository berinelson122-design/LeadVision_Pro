import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, AlertTriangle } from 'lucide-react';
import { PropertyData, SortField, SortDirection } from '../types';

interface SniperTableProps {
  data: PropertyData[];
}

const SniperTable: React.FC<SniperTableProps> = ({ data }) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>(SortField.PRICE);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC);
    } else {
      setSortField(field);
      setSortDirection(SortDirection.DESC);
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let result = data.filter(item => 
      item.address.toLowerCase().includes(search.toLowerCase()) ||
      item.zip.includes(search) ||
      item.status.toLowerCase().includes(search.toLowerCase())
    );

    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === SortDirection.ASC 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === SortDirection.ASC 
        ? (aValue as number) - (bValue as number) 
        : (bValue as number) - (aValue as number);
    });

    return result;
  }, [data, search, sortField, sortDirection]);

  return (
    <div className="w-full bg-[#0a0a0a] border border-gray-800 rounded-sm overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/50 backdrop-blur">
        <div className="flex items-center gap-2 text-[#00f3ff]">
          <AlertTriangle size={18} />
          <h2 className="text-lg font-bold tracking-widest">SNIPER_FEED</h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="SEARCH SECTOR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black border border-gray-700 text-[#00f3ff] text-sm px-4 py-2 pl-10 focus:outline-none focus:border-[#00f3ff] w-64 placeholder-gray-700"
          />
          <Search className="absolute left-3 top-2.5 text-gray-700" size={14} />
        </div>
      </div>

      <div className="overflow-auto flex-1 custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#050505] sticky top-0 z-10 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              {[
                { label: 'Address', field: SortField.ZIP }, // Simplified sorting for address col using zip/string
                { label: 'Zip', field: SortField.ZIP },
                { label: 'Price', field: SortField.PRICE },
                { label: 'SqFt', field: SortField.SQFT },
                { label: '$/SqFt', field: SortField.PRICE },
                { label: 'Status', field: SortField.STATUS },
                { label: 'Distress', field: SortField.PRICECUT },
              ].map((col, idx) => (
                <th 
                  key={idx}
                  className="px-6 py-4 border-b border-gray-800 cursor-pointer hover:text-[#00f3ff] transition-colors"
                  onClick={() => handleSort(col.field)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    <ArrowUpDown size={12} className="opacity-50" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900 text-sm font-mono">
            {filteredAndSortedData.map((row) => {
              const isDistressed = row.status === 'AUCTION' || row.status === 'FORECLOSURE' || row.priceCut > 0;
              const glowClass = isDistressed ? 'text-[#ff003c] drop-shadow-[0_0_8px_rgba(255,0,60,0.4)]' : 'text-gray-400';
              const bgClass = isDistressed ? 'bg-[#ff003c]/5' : '';

              return (
                <tr key={row.id} className={`hover:bg-white/5 transition-colors ${bgClass}`}>
                  <td className={`px-6 py-4 ${isDistressed ? 'text-[#ff003c]' : 'text-gray-300'}`}>{row.address}</td>
                  <td className="px-6 py-4 text-gray-500">{row.zip}</td>
                  <td className="px-6 py-4 font-bold">${row.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-500">{row.sqft.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-500">${row.pricePerSqFt}</td>
                  <td className={`px-6 py-4 font-bold tracking-wider ${glowClass}`}>
                    {row.status}
                  </td>
                  <td className={`px-6 py-4 ${row.priceCut > 0 ? 'text-[#ff003c]' : 'text-gray-600'}`}>
                    {row.priceCut > 0 ? `-$${row.priceCut.toLocaleString()}` : '0'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredAndSortedData.length === 0 && (
          <div className="p-12 text-center text-gray-600">
            NO SIGNALS DETECTED IN CURRENT SECTOR
          </div>
        )}
      </div>
    </div>
  );
};

export default SniperTable;