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
              <stop offset="5%" stopColor="#3699FF" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#3699FF" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFA800" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#FFA800" stopOpacity={0}/>
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6c7293', fontSize: 11, fontWeight: 500}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#6c7293', fontSize: 11, fontWeight: 500}} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1E1E2D', borderRadius: '8px', border: '1px solid #2B2B40', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}
            itemStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '13px' }}
            labelStyle={{ color: '#6c7293', fontSize: '12px', marginBottom: '4px' }}
            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area 
            type="monotone" 
            dataKey="visits" 
            stroke="#FFA800" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorVisits)" 
            activeDot={{ r: 5, strokeWidth: 2, stroke: '#1E1E2D', fill: '#FFA800' }}
            style={{ filter: "url(#glow)" }}
          />
          <Area 
            type="monotone" 
            dataKey="sales" 
            stroke="#3699FF" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorSales)" 
            activeDot={{ r: 5, strokeWidth: 2, stroke: '#1E1E2D', fill: '#3699FF' }}
            style={{ filter: "url(#glow)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
