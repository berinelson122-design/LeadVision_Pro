import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid 
} from 'recharts';
import { PropertyData } from '../types';

interface AnalyticsProps {
  data: PropertyData[];
}

const COLORS = ['#00f3ff', '#ff003c', '#e056fd', '#ffffff'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border border-[#00f3ff] p-3 shadow-[0_0_10px_rgba(0,243,255,0.2)]">
        <p className="text-[#00f3ff] text-xs font-bold mb-1">{label}</p>
        <p className="text-white text-sm">
          {payload[0].name}: {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const Analytics: React.FC<AnalyticsProps> = ({ data }) => {
  
  // 1. Market Hotness: Price/SqFt by Zip
  const marketHotnessData = useMemo(() => {
    const zipMap: Record<string, { total: number; count: number }> = {};
    data.forEach(item => {
      if (!zipMap[item.zip]) zipMap[item.zip] = { total: 0, count: 0 };
      zipMap[item.zip].total += item.pricePerSqFt;
      zipMap[item.zip].count += 1;
    });
    return Object.keys(zipMap).map(zip => ({
      name: zip,
      value: Math.round(zipMap[zip].total / zipMap[zip].count)
    })).sort((a, b) => b.value - a.value).slice(0, 8); // Top 8 Zips
  }, [data]);

  // 2. Distress Distribution: Pie Chart
  const distressData = useMemo(() => {
    const counts = { STANDARD: 0, AUCTION: 0, FORECLOSURE: 0 };
    data.forEach(item => {
      if (item.status === 'STANDARD') counts.STANDARD++;
      else if (item.status === 'AUCTION') counts.AUCTION++;
      else if (item.status === 'FORECLOSURE') counts.FORECLOSURE++;
    });
    return [
      { name: 'Standard', value: counts.STANDARD },
      { name: 'Auction', value: counts.AUCTION },
      { name: 'Foreclosure', value: counts.FORECLOSURE }
    ].filter(d => d.value > 0);
  }, [data]);

  // 3. Timeline Flux: Price cuts over time
  const timelineData = useMemo(() => {
    // Group price cuts by date
    const dateMap: Record<string, number> = {};
    const sortedData = [...data].sort((a, b) => new Date(a.dateListed).getTime() - new Date(b.dateListed).getTime());
    
    sortedData.forEach(item => {
      if (item.priceCut > 0) {
        // format YYYY-MM
        const month = item.dateListed.substring(0, 7); 
        dateMap[month] = (dateMap[month] || 0) + item.priceCut;
      }
    });

    return Object.keys(dateMap).map(date => ({
      name: date,
      value: dateMap[date]
    }));
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* Chart 1: Market Hotness */}
      <div className="bg-[#0a0a0a] border border-gray-800 p-4 rounded-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-[#00f3ff]/5 rounded-bl-full -z-0"></div>
        <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-4 z-10 relative">Market Hotness ($/SqFt)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marketHotnessData}>
              <XAxis dataKey="name" stroke="#333" tick={{fill: '#666', fontSize: 10}} />
              <YAxis stroke="#333" tick={{fill: '#666', fontSize: 10}} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255, 255, 255, 0.05)'}} />
              <Bar dataKey="value" fill="#00f3ff" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Distress Distribution */}
      <div className="bg-[#0a0a0a] border border-gray-800 p-4 rounded-sm">
        <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-4">Distress Signal</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distressData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {distressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === 'Standard' ? '#333' : (entry.name === 'Auction' ? '#ff003c' : '#e056fd')} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-[10px] uppercase tracking-wider text-gray-500 mt-[-10px]">
            {distressData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.name === 'Standard' ? '#333' : (d.name === 'Auction' ? '#ff003c' : '#e056fd') }}></div>
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 3: Timeline Flux */}
      <div className="bg-[#0a0a0a] border border-gray-800 p-4 rounded-sm">
        <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-4">Capital Bleed (Cuts Over Time)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="name" stroke="#333" tick={{fill: '#666', fontSize: 10}} />
              <YAxis stroke="#333" tick={{fill: '#666', fontSize: 10}} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#e056fd" 
                strokeWidth={2} 
                dot={{r: 2, fill: '#e056fd'}} 
                activeDot={{r: 4, stroke: '#fff'}} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default Analytics;