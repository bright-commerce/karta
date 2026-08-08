"use client";

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: 'Jan', value: 8 },
  { name: 'Feb', value: 6 },
  { name: 'Mar', value: 14 },
  { name: 'Apr', value: 9 },
  { name: 'May', value: 11 },
  { name: 'Jun', value: 7 },
];

export default function OrderStatusChart() {
  return (
    <div className="w-full h-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F64E60" />
              <stop offset="100%" stopColor="#FFA800" />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6c7293', fontSize: 11, fontWeight: 500 }} 
            dy={10} 
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
            contentStyle={{ backgroundColor: '#1E1E2D', borderRadius: '8px', border: '1px solid #2B2B40', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={12}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="url(#barGradient)" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
