import React, { useState } from 'react';
import { Activity, Download, Terminal, Cpu } from 'lucide-react';
import FileUpload from './components/FileUpload';
import SniperTable from './components/SniperTable';
import Analytics from './components/Analytics';
import { generatePDFReport } from './utils/pdfGenerator';
import { PropertyData } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<PropertyData[]>([]);

  return (
    <div className="min-h-screen bg-black text-[#e5e5e5] p-6 font-sans selection:bg-[#E056FD] selection:text-black">
      
      {/* HEADER */}
      <header className="max-w-7xl mx-auto mb-12 flex justify-between items-end border-b border-[#333] pb-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-1 text-white flex items-center gap-3">
            <Activity className="text-[#FF003C]" />
            LEADVISION <span className="text-[#E056FD]">PRO</span>
          </h1>
          <p className="text-xs text-[#666] font-mono tracking-[0.3em]">MARKET INTELLIGENCE // V2.0.0</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#444]">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-[#FF003C] rounded-full animate-pulse"></div>
             SYSTEM ONLINE
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto">
        {data.length === 0 ? (
          <FileUpload onDataLoaded={setData} />
        ) : (
          <div className="animate-fade-in space-y-8">
            
            {/* CONTROL DECK */}
            <div className="flex justify-between items-center bg-[#050505] p-4 border border-[#222]">
              <div className="flex items-center gap-4 font-mono">
                <div className="text-xs text-gray-500">LOADED ASSETS: <span className="text-white text-sm">{data.length}</span></div>
                <div className="h-4 w-px bg-[#333]"></div>
                <div className="text-xs text-gray-500">TARGETS: <span className="text-[#FF003C] text-sm">{data.filter(d => d.status !== 'Standard').length}</span></div>
              </div>
              
              <div className="flex gap-4">
                 <button
                  onClick={() => setData([])}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-700 hover:border-white text-gray-400 hover:text-white text-xs tracking-wider transition-colors font-mono uppercase"
                >
                  <Terminal size={14} />
                  Reset Uplink
                </button>
                <button
                  onClick={() => generatePDFReport(data)}
                  className="flex items-center gap-2 px-6 py-2 bg-[#E056FD] text-black font-bold text-xs tracking-wider hover:bg-[#c93bf5] transition-all shadow-[0_0_20px_rgba(224,86,253,0.4)] font-mono uppercase"
                >
                  <Download size={14} />
                  Export Report
                </button>
              </div>
            </div>

            <Analytics data={data} />
            <SniperTable data={data} />
          </div>
        )}
      </main>

      {/* WATERMARK */}
      <div className="fixed bottom-4 right-6 text-[10px] text-[#333] font-mono flex items-center gap-2 pointer-events-none select-none">
        <Cpu size={12} />
        ARCHITECT // VOID_WEAVER
      </div>
    </div>
  );
};

export default App;