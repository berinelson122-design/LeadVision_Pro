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
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] p-6 selection:bg-[#00f3ff] selection:text-black">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12 flex justify-between items-end border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter mb-1 text-white flex items-center gap-3">
            <Activity className="text-[#00f3ff]" />
            LEADVISION <span className="text-[#00f3ff]">PRO</span>
          </h1>
          <p className="text-xs text-gray-500 font-mono tracking-[0.3em]">MARKET INTELLIGENCE // V1.0.4</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00f3ff] rounded-full animate-pulse"></div>
            SYSTEM ONLINE
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <FileUpload onDataLoaded={setData} />
            <div className="mt-12 text-center text-gray-700 font-mono text-xs">
              <p>SECURE CONNECTION ESTABLISHED</p>
              <p className="mt-2">AWAITING DATA STREAM...</p>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">

            {/* Control Bar */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-[#0a0a0a] border border-gray-800 text-xs tracking-widest text-[#00f3ff]">
                  RECORDS: {data.length}
                </div>
                <div className="px-4 py-2 bg-[#0a0a0a] border border-gray-800 text-xs tracking-widest text-[#ff003c]">
                  ALERTS: {data.filter(d => d.status !== 'STANDARD' || d.priceCut > 0).length}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setData([])}
                  className="flex items-center gap-2 px-6 py-2 border border-gray-800 hover:border-gray-600 text-gray-400 text-xs tracking-wider transition-colors"
                >
                  <Terminal size={14} />
                  RESET
                </button>
                <button
                  onClick={() => generatePDFReport(data)}
                  className="flex items-center gap-2 px-6 py-2 bg-[#00f3ff] text-black font-bold text-xs tracking-wider hover:bg-[#00f3ff]/80 transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)]"
                >
                  <Download size={14} />
                  EXPORT INTEL
                </button>
              </div>
            </div>

            {/* Analytics Engine */}
            <Analytics data={data} />

            {/* Sniper Table */}
            <SniperTable data={data} />
          </div>
        )}
      </main>

      {/* Footer / Watermark */}
      <div className="fixed bottom-6 right-6 text-[10px] text-gray-800 font-mono flex items-center gap-2 pointer-events-none">
        <Cpu size={12} />
        ARCHITECT // VOID_WEAVER
      </div>
    </div>
  );
};

export default App;