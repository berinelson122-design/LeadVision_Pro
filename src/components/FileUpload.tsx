import React, { useRef, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { parseCSV, generateDemoData } from '../utils/csvParser';
import { PropertyData } from '../types';

interface FileUploadProps {
  onDataLoaded: (data: PropertyData[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const processFile = (file: File) => {
    setError(null);
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('INVALID PROTOCOL: CSV REQUIRED');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const data = parseCSV(text);
        onDataLoaded(data);
      } catch (err) {
        setError('DATA CORRUPTION DETECTED DURING PARSE');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const loadDemo = () => {
    onDataLoaded(generateDemoData());
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <div 
        className={`relative border-2 border-dashed transition-all duration-300 p-12 text-center group cursor-pointer
          ${isDragging 
            ? 'border-[#00f3ff] bg-[#00f3ff]/10 scale-[1.02]' 
            : 'border-gray-700 hover:border-[#00f3ff]/50 bg-[#0a0a0a]'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".csv"
          onChange={(e) => e.target.files && processFile(e.target.files[0])}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full bg-black border border-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-transform duration-500 ${isDragging ? 'rotate-180' : ''}`}>
            <Upload className="w-8 h-8 text-[#00f3ff]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#e5e5e5] tracking-widest">UPLOAD MARKET DATA</h3>
            <p className="text-gray-500 mt-2 text-sm font-light">DRAG CSV OR CLICK TO SCAN SECTOR</p>
          </div>
        </div>

        {error && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 text-[#ff003c] animate-pulse">
            <AlertCircle size={16} />
            <span className="text-xs tracking-widest">{error}</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button 
          onClick={loadDemo}
          className="flex items-center gap-2 px-6 py-2 bg-transparent border border-gray-700 hover:border-[#00f3ff] text-gray-400 hover:text-[#00f3ff] transition-all duration-300 text-xs tracking-[0.2em] uppercase"
        >
          <FileText size={14} />
          Initialize Demo Protocol
        </button>
      </div>
    </div>
  );
};

export default FileUpload;