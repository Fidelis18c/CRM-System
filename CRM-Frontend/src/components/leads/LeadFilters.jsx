import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineSearch, HiOutlineFilter, HiOutlineChevronDown, HiOutlineCheck } from 'react-icons/hi';

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: '' },
  { label: 'New', value: 'NEW' },
  { label: 'Contacted', value: 'CONTACTED' },
  { label: 'Qualified', value: 'QUALIFIED' },
  { label: 'Converted', value: 'CONVERTED' },
  { label: 'Lost', value: 'LOST' },
];

const LeadFilters = ({ onSearch, onSort, onFilter, currentSort = 'newest', currentFilter = '' }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeFilterLabel = STATUS_OPTIONS.find((o) => o.value === currentFilter)?.label || 'All Statuses';
  const hasActiveFilter = currentFilter !== '';

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
        {/* Sort Dropdown */}
        <div className="relative group">
          <select
            value={currentSort}
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

        {/* Filter Button with Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen((prev) => !prev)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
              hasActiveFilter
                ? 'bg-[#111827] text-white border-[#111827] hover:bg-[#222]'
                : 'bg-white border-[#e5e7eb] text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#111827]'
            }`}
          >
            <HiOutlineFilter size={18} />
            <span>{hasActiveFilter ? activeFilterLabel : 'Filters'}</span>
            <HiOutlineChevronDown size={14} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </button>

          {filterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e5e7eb] rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-2 space-y-0.5">
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">Filter by Status</p>
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onFilter(opt.value);
                      setFilterOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      currentFilter === opt.value
                        ? 'bg-[#f3f4f6] text-[#111827] font-bold'
                        : 'text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#111827]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {currentFilter === opt.value && <HiOutlineCheck size={14} className="text-[#111827]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadFilters;
