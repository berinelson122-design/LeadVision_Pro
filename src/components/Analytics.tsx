import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid
} from 'recharts';
import { PropertyData } from '../types';

interface AnalyticsProps {
  data: PropertyData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border border-[#E056FD] p-3 shadow-[0_0_15px_rgba(224,86,253,0.2)]">
        <p className="text-[#E056FD] text-xs font-bold mb-1 font-mono">{label}</p>
        <p className="text-white text-sm font-mono">
          {payload[0].name}: {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const Analytics: React.FC<AnalyticsProps> = ({ data }) => {
  // Metric: Distress Ratio
  const distressData = useMemo(() => {
    const counts = { STANDARD: 0, DISTRESSED: 0 };
    data.forEach(item => {
      if (item.status === 'Standard' || item.status === 'STANDARD') counts.STANDARD++;
      else counts.DISTRESSED++;
    });
    return [
      { name: 'Standard', value: counts.STANDARD },
      { name: 'Distressed', value: counts.DISTRESSED }
    ].filter(d => d.value > 0);
  }, [data]);

  // Metric: Price Distribution
  const priceData = useMemo(() => {
      // Simple bucket logic
      const buckets = { 'Under 50k': 0, '50k-150k': 0, '150k+': 0 };
      data.forEach(item => {
          if (item.price < 50000) buckets['Under 50k']++;
          else if (item.price < 150000) buckets['50k-150k']++;
          else buckets['150k+']++;
      });
      return Object.keys(buckets).map(key => ({ name: key, value: buckets[key as keyof typeof buckets] }));
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* DISTRESS RATIO */}
      <div className="bg-[#050505] border border-[#333] p-4 rounded-sm relative overflow-hidden group hover:border-[#FF003C] transition-colors">
        <h3 className="text-xs text-[#FF003C] font-bold uppercase tracking-widest mb-4 font-mono">Signal Integrity</h3>
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
                  <Cell key={`cell-${index}`} fill={entry.name === 'Standard' ? '#222' : '#FF003C'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PRICE BUCKETS */}
      <div className="bg-[#050505] border border-[#333] p-4 rounded-sm hover:border-[#E056FD] transition-colors">
        <h3 className="text-xs text-[#E056FD] font-bold uppercase tracking-widest mb-4 font-mono">Asset Valuation</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="name" stroke="#333" tick={{fill: '#666', fontSize: 10, fontFamily: 'monospace'}} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(224, 86, 253, 0.1)'}} />
              <Bar dataKey="value" fill="#E056FD" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default Analytics;