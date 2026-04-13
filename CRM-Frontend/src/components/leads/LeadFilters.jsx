import React from 'react';
import { HiOutlineSearch, HiOutlineFilter, HiOutlineChevronDown } from 'react-icons/hi';

const LeadFilters = ({ onSearch, onSort }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#e5e7eb] p-4 rounded-xl shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md group">
        <HiOutlineSearch 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af] group-focus-within:text-[#111827] transition-colors" 
          size={20} 
        />
        <input
          type="text"
          placeholder="Search by name or email..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl py-3 pl-12 pr-4 text-sm text-[#111827] focus:outline-none focus:border-[#111827]/30 focus:ring-4 focus:ring-black/5 transition-all placeholder:text-[#9ca3af]"
        />
      </div>

      {/* Action Buttons / Sort */}
      <div className="flex items-center space-x-3">
        <div className="relative group">
          <select 
            onChange={(e) => onSort(e.target.value)}
            className="appearance-none bg-[#f9fafb] border border-[#e5e7eb] rounded-xl py-3 pl-4 pr-10 text-sm text-[#111827] focus:outline-none focus:border-[#111827]/30 cursor-pointer transition-all hover:bg-[#f3f4f6]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>
          <HiOutlineChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" size={16} />
        </div>

        <button className="flex items-center space-x-2 bg-white border border-[#e5e7eb] px-4 py-3 rounded-xl text-sm font-semibold text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#111827] transition-all">
          <HiOutlineFilter size={18} />
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
};

export default LeadFilters;
