import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-[#e5e7eb] p-3 rounded-lg shadow-xl">
        <p className="text-[#6b7280] text-xs mb-1 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-[#111827] text-lg font-bold">{payload[0].value} Leads</p>
      </div>
    );
  }
  return null;
};

export const DailyLeadVolume = ({ data = [] }) => {
  // Map backend format {_id: date, count: N} to chart format {name: date, leads: N}
  const chartData = data.map(item => ({
    name: item._id,
    leads: item.count
  }));

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 10 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="leads" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorLeads)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const StatusDistribution = ({ data = [] }) => {
  // Map backend format {_id: status, count: N} to chart format {name: status, value: N}
  const chartData = data.map(item => ({
    name: item._id,
    value: item.count
  }));

  // Color mapping based on status name
  const getColor = (name) => {
    const status = name?.toLowerCase() || '';
    if (status.includes('active') || status.includes('contacted')) return '#059669'; // Green
    if (status.includes('pending') || status.includes('lead') || status.includes('qualified')) return '#D97706';   // Yellow
    if (status.includes('new') || status.includes('prospect')) return '#7C3AED';    // Purple
    return '#6b7280'; // Default gray
  };

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="h-[350px] w-full relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={120}
            paddingAngle={8}
            dataKey="value"
            stroke="none"
            animationDuration={1500}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-[#111827]">{total.toLocaleString()}</span>
        <span className="text-xs text-[#6b7280] uppercase tracking-widest font-bold">Total Leads</span>
      </div>
    </div>
  );
};


