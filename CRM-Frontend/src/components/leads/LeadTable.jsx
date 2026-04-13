import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TableRowSkeleton } from '../ui/Skeleton';

const cn = (...inputs) => twMerge(clsx(inputs));

const StatusBadge = ({ status }) => {
  const styles = {
    NEW: "bg-[#f5f3ff] text-[#7c3aed] border-[#ddd6fe]",
    CONTACTED: "bg-[#ecfdf5] text-[#059669] border-[#d1fae5]",
    QUALIFIED: "bg-[#fffbeb] text-[#d97706] border-[#fef3c7]",
    CONVERTED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    LOST: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      styles[status] || styles.NEW
    )}>
      {status}
    </span>
  );
};

const LeadTable = ({ 
  leads = [], 
  onLeadClick, 
  loading = false, 
  currentPage = 1, 
  totalPages = 1, 
  totalResults = 0,
  onPageChange 
}) => {
  const startResult = (currentPage - 1) * 10 + 1;
  const endResult = Math.min(currentPage * 10, totalResults);

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
              <th className="px-6 py-4 text-xs font-bold text-[#6b7280] uppercase tracking-widest">Lead Name</th>
              <th className="px-6 py-4 text-xs font-bold text-[#6b7280] uppercase tracking-widest">Email Address</th>
              <th className="px-6 py-4 text-xs font-bold text-[#6b7280] uppercase tracking-widest">Source</th>
              <th className="px-6 py-4 text-xs font-bold text-[#6b7280] uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-[#6b7280] uppercase tracking-widest">Created Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => <TableRowSkeleton key={i} columns={5} />)
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-[#6b7280] text-sm italic">
                  No leads found.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead._id || lead.id}
                  onClick={() => onLeadClick(lead)}
                  className="group hover:bg-[#f9fafb] transition-all duration-200 cursor-pointer"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-bold text-[#111827] group-hover:text-black transition-colors">
                        {lead.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-[#6b7280] group-hover:text-[#111827] transition-colors">{lead.email}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2 py-1 rounded-md bg-[#f9fafb] text-[10px] font-medium text-[#6b7280] border border-[#e5e7eb]">
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-slate-500">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : new Date(lead.date).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-6 border-t border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-medium text-[#6b7280]">
          Showing <span className="text-[#111827]">{totalResults > 0 ? startResult : 0}</span> to <span className="text-[#111827]">{endResult}</span> of <span className="text-[#111827]">{totalResults}</span> results
        </span>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 rounded-lg text-xs font-bold text-[#6b7280] border border-[#e5e7eb] hover:bg-[#f9fafb] hover:text-[#111827] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="flex items-center px-4 py-2 bg-[#f9fafb] rounded-lg border border-[#e5e7eb]">
            <span className="text-xs font-bold text-[#111827]">Page {currentPage} of {totalPages}</span>
          </div>
          <button 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#000000] border border-black hover:bg-[#222222] shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadTable;
