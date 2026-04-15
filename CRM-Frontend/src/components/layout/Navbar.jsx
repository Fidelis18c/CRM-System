import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineChevronDown, HiMenuAlt2, HiOutlineLogout, HiOutlineUser } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Read user info from localStorage if available
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  })();
  const displayName = storedUser.firstName
    ? `${storedUser.firstName} ${storedUser.lastName || ''}`.trim()
    : 'Fidelis Joseph';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[20%] h-20 bg-white/80 backdrop-blur-xl border-b border-[#e5e7eb] z-30 px-6">
      <div className="h-full flex items-center justify-between gap-6">
        {/* Left: Mobile Toggle */}
        <div className="flex items-center space-x-4 lg:hidden">
          <button
            onClick={onMenuClick}
            className="p-2 text-[#6b7280] hover:bg-[#f3f4f6] rounded-lg transition-colors"
          >
            <HiMenuAlt2 size={24} />
          </button>
          <span className="text-xl font-bold text-[#111827] whitespace-nowrap">Dashboard</span>
        </div>

        {/* Right: Admin Profile Dropdown */}
        <div className="ml-auto relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center space-x-3 p-1.5 hover:bg-[#f3f4f6] rounded-xl transition-colors group"
            id="admin-profile-btn"
          >
            <div className="w-9 h-9 rounded-lg bg-[#111827] flex items-center justify-center text-white font-bold text-sm">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-[#111827]">{displayName}</p>
              <p className="text-[10px] text-[#6b7280] uppercase tracking-wider">Admin</p>
            </div>
            <HiOutlineChevronDown
              className={`text-[#9ca3af] group-hover:text-[#111827] transition-all duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              size={16}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-[#e5e7eb] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-[#f3f4f6]">
                <p className="text-sm font-semibold text-[#111827] truncate">{displayName}</p>
                <p className="text-xs text-[#9ca3af] truncate">{storedUser.email || 'admin@crm.com'}</p>
              </div>

              {/* Profile item */}
              <div className="p-1.5">
                <button
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#111827] transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <HiOutlineUser size={17} />
                  <span>My Profile</span>
                </button>

                <div className="my-1 border-t border-[#f3f4f6]" />

                {/* Logout */}
                <button
                  id="logout-btn"
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                >
                  <HiOutlineLogout size={17} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
