import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineChartBar, HiOutlineUsers, HiOutlineClipboardList, HiOutlineX, HiOutlineLogout } from 'react-icons/hi';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const navItems = [
  { name: 'Dashboard', path: '/', icon: HiOutlineChartBar },
  { name: 'Leads', path: '/leads', icon: HiOutlineUsers },
  { name: 'Activity Logs', path: '/logs', icon: HiOutlineClipboardList },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-[280px] lg:w-[20%] bg-white border-r border-[#e5e7eb] z-50 transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#000000] rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">FJ</span>
              </div>
              <span className="text-xl font-bold text-[#111827]">
                Portfolio CRM
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-[#6b7280] hover:text-[#111827] transition-colors"
            >
              <HiOutlineX size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2 mt-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-[#f3f4f6] text-[#000000]"
                      : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
                  )
                }
              >
                <item.icon size={22} className={cn("transition-transform group-hover:scale-105")} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Foo */}
          <div className="p-4 mt-auto space-y-2">
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors"
            >
              <HiOutlineLogout size={22} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};


export default Sidebar;
