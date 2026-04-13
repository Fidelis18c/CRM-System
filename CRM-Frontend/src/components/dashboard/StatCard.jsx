import React from 'react';

const StatCard = ({ title, value, }) => {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300">
      
      <div className="space-y-2">
        <h3 className="text-[#6b7280] text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-[#111827] tracking-tight">{value}</p>
      </div>

    </div>
  );
};

export default StatCard;
