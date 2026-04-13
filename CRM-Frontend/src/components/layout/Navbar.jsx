import React from 'react';
import { HiOutlineSearch, HiOutlineBell, HiOutlineChevronDown, HiMenuAlt2 } from 'react-icons/hi';

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[20%] h-20 bg-white/80 backdrop-blur-xl border-b border-[#e5e7eb] z-30 px-6">
      <div className="h-full flex items-center justify-between gap-6">
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center space-x-4 lg:hidden">
          <button
            onClick={onMenuClick}
            className="p-2 text-[#6b7280] hover:bg-[#f3f4f6] rounded-lg transition-colors"
          >
            <HiMenuAlt2 size={24} />
          </button>
          <span className="text-xl font-bold text-[#111827] whitespace-nowrap">Dashboard</span>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl relative group">
          <HiOutlineSearch 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af] group-focus-within:text-[#111827] transition-colors" 
            size={20} 
          />
          <input
            type="text"
            placeholder="Search leads, activities, or logs..."
            className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl py-2.5 pl-12 pr-4 text-sm text-[#111827] focus:outline-none focus:border-[#111827]/30 focus:ring-4 focus:ring-black/5 transition-all placeholder:text-[#9ca3af]"
          />
        </div>

        {/* Right: Profile & Notifications */}
        <div className="flex items-center space-x-4">
  
          
          <div className="h-8 w-px bg-[#e5e7eb]" />

          <button className="flex items-center space-x-3 p-1.5 hover:bg-[#f3f4f6] rounded-xl transition-colors group">
            <div className="w-9 h-9 rounded-lg bg-[#f3f4f6] flex items-center justify-center text-[#6b7280] font-medium">
              FJ
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-[#111827]">Fidelis Joseph</p>
              <p className="text-[10px] text-[#6b7280] uppercase tracking-wider">Admin</p>
            </div>
            <HiOutlineChevronDown className="text-[#9ca3af] group-hover:text-[#111827] transition-colors" size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
