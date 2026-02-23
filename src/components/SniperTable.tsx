import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ExternalLink, ShieldAlert } from 'lucide-react';
import { PropertyData } from '../types';

interface SniperTableProps {
  data: PropertyData[];
}

const SniperTable: React.FC<SniperTableProps> = ({ data }) => {
  const [search, setSearch] = useState('');
  const [onlyDistressed, setOnlyDistressed] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.address.toLowerCase().includes(search.toLowerCase()) || item.zip.includes(search);
      const matchesDistress = onlyDistressed ? item.status !== 'Standard' && item.status !== 'STANDARD' : true;
      return matchesSearch && matchesDistress;
    });
  }, [data, search, onlyDistressed]);

  return (
    <div className="w-full bg-[#050505] border border-[#333] rounded-sm overflow-hidden flex flex-col h-[600px] shadow-2xl">
      
      {/* TOOLBAR */}
      <div className="p-4 border-b border-[#333] flex justify-between items-center bg-black/50 backdrop-blur">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[#E056FD]">
                <ShieldAlert size={18} />
                <h2 className="text-lg font-bold tracking-widest font-mono">DATA_FEED</h2>
            </div>
            
            <button 
                onClick={() => setOnlyDistressed(!onlyDistressed)}
                className={`px-3 py-1 text-[10px] font-mono border uppercase transition-all ${onlyDistressed ? 'bg-[#FF003C] text-black border-[#FF003C] font-bold' : 'border-gray-700 text-gray-500 hover:border-[#FF003C]'}`}
            >
                {onlyDistressed ? 'SNIPER MODE: ON' : 'SNIPER MODE: OFF'}
            </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="SEARCH SECTOR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black border border-gray-700 text-[#E056FD] text-sm px-4 py-2 pl-10 focus:outline-none focus:border-[#E056FD] w-64 placeholder-gray-800 font-mono"
          />
          <Search className="absolute left-3 top-2.5 text-gray-700" size={14} />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-auto flex-1 custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#080808] sticky top-0 z-10 text-xs text-gray-500 uppercase tracking-wider font-mono">
            <tr>
              <th className="px-6 py-3 border-b border-[#222]">Address</th>
              <th className="px-6 py-3 border-b border-[#222]">Price</th>
              <th className="px-6 py-3 border-b border-[#222]">Status</th>
              <th className="px-6 py-3 border-b border-[#222]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a] text-sm font-mono">
            {filteredData.map((row) => {
              const isDistressed = row.status !== 'Standard' && row.status !== 'STANDARD';
              const rowClass = isDistressed ? 'bg-[#FF003C]/5 hover:bg-[#FF003C]/10' : 'hover:bg-white/5';
              const textClass = isDistressed ? 'text-[#FF003C] font-bold' : 'text-gray-400';

              return (
                <tr key={row.id} className={`transition-colors ${rowClass}`}>
                  <td className="px-6 py-3 text-gray-300 truncate max-w-xs">{row.address}</td>
                  <td className="px-6 py-3 font-bold text-white">{row.priceStr}</td>
                  <td className={`px-6 py-3 tracking-wider ${textClass}`}>
                    {row.status}
                  </td>
                  <td className="px-6 py-3">
                    <a 
                        href={row.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 text-[#E056FD] hover:text-white text-xs uppercase hover:underline"
                    >
                        Intel <ExternalLink size={10} />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredData.length === 0 && (
          <div className="p-12 text-center text-gray-700 font-mono text-sm">
            NO SIGNALS DETECTED IN CURRENT SECTOR
          </div>
        )}
      </div>
    </div>
  );
};

export default SniperTable;