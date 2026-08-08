"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', sales: 4000, visits: 2400 },
  { name: 'Tue', sales: 3000, visits: 1398 },
  { name: 'Wed', sales: 2000, visits: 9800 },
  { name: 'Thu', sales: 2780, visits: 3908 },
  { name: 'Fri', sales: 1890, visits: 4800 },
  { name: 'Sat', sales: 2390, visits: 3800 },
  { name: 'Sun', sales: 3490, visits: 4300 },
];

export default function ActivityChart() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#111827" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#111827" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSalesDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F9FAFB" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#F9FAFB" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.15)" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11, fontWeight: 500}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11, fontWeight: 500}} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
            itemStyle={{ color: '#111827', fontWeight: 'bold', fontSize: '13px' }}
            labelStyle={{ color: '#6B7280', fontSize: '12px', marginBottom: '4px' }}
            cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area 
            type="monotone" 
            dataKey="sales" 
            stroke="currentColor" 
            className="text-gray-900 dark:text-gray-100" 
            strokeWidth={2} 
            fillOpacity={1} 
            fill="url(#colorSales)" 
            activeDot={{ r: 4, strokeWidth: 0, fill: '#111827' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
