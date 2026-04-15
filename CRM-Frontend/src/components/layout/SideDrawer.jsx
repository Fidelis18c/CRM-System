import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX, HiOutlineMail, HiOutlineCalendar } from 'react-icons/hi';
import { AiOutlineSend } from 'react-icons/ai';
import api from '../../services/api';
import Skeleton from '../ui/Skeleton';

const SideDrawer = ({ lead, isOpen, onClose, isLoading, onNoteAdded }) => {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveNote = async () => {
  if (!note.trim()) return;

  const leadId = lead?._id || lead?.id;

  if (!leadId) {
    console.error('Lead ID is missing');
    alert('Something went wrong. Please refresh.');
    return;
  }

  try {
    setIsSubmitting(true);

    await api.post(`/leads/${leadId}/notes`, {
      content: note.trim(),
    });

    setNote('');

    // 🔥 Re-fetch updated lead (this is IMPORTANT)
    if (onNoteAdded) {
      await onNoteAdded();
    }

  } catch (err) {
    console.error('Failed to save note:', err);

    const message =
      err?.response?.data?.message || 'Failed to save note. Try again.';
    alert(message);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleStatusUpdate = async (newStatus) => {
    const leadId = lead._id || lead.id;
    try {
      setIsSubmitting(true);
      await api.patch(`/leads/${leadId}/status`, { status: newStatus });
      if (onNoteAdded) onNoteAdded();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const notes = lead?.notes || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[500px] lg:w-[35%] bg-white border-l border-[#e5e7eb] shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#e5e7eb] flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-[#f3f4f6] text-[#111827] flex items-center justify-center font-bold text-xl border border-[#e5e7eb]">
                  {isLoading ? <Skeleton className="w-full h-full rounded-lg" /> : lead?.name?.charAt(0)}
                </div>
                <div>
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-[#111827] leading-tight">{lead?.name}</h2>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                        <span className="text-xs text-[#6b7280] capitalize font-bold">{lead?.status}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] rounded-lg transition-all"
              >
                <HiOutlineX size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">

              {/* Contact Info */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-widest">Details</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-4 bg-[#f9fafb] rounded-xl border border-[#e5e7eb] group hover:border-[#111827]/20 transition-colors">
                    <div className="flex items-center space-x-3">
                      <HiOutlineMail className="text-[#9ca3af] group-hover:text-[#111827] transition-colors" size={20} />
                      <span className="text-sm text-[#111827] font-medium">
                        {isLoading ? <Skeleton className="h-4 w-40" /> : lead?.email}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-[#f9fafb] rounded-xl border border-[#e5e7eb] group hover:border-[#111827]/20 transition-colors">
                    <div className="flex items-center space-x-3">
                      <HiOutlineCalendar className="text-[#9ca3af] group-hover:text-[#111827] transition-colors" size={20} />
                      <span className="text-sm text-[#111827] font-medium">
                        {isLoading
                          ? <Skeleton className="h-4 w-32" />
                          : `Created on ${new Date(lead?.createdAt || lead?.date).toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-widest">Update Status</h3>
                <select
                  className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-3 text-[#111827] focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-bold"
                  value={lead?.status || 'NEW'}
                  disabled={isLoading || isSubmitting}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                >
                  <option value="NEW">New Lead</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="CONVERTED">Converted</option>
                  <option value="LOST">Lost</option>
                </select>
              </div>

              {/* Notes Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-widest">Notes</h3>
                  {notes.length > 0 && (
                    <span className="text-[10px] font-bold bg-[#f3f4f6] text-[#6b7280] px-2 py-0.5 rounded-full">
                      {notes.length}
                    </span>
                  )}
                </div>

                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                  </div>
                ) : notes.length > 0 ? (
                  <div className="space-y-3 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#e5e7eb]">
                    {notes.map((n, i) => (
                      <div key={n._id || i} className="relative pl-8">
                        <div className="bg-[#f9fafb] p-4 rounded-xl border border-[#e5e7eb] hover:border-[#111827]/20 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[#111827]">
                              {n.adminId
                                ? `${n.adminId.firstName || ''} ${n.adminId.lastName || ''}`.trim() || n.adminId.email || 'Admin'
                                : 'Admin'}
                            </span>
                            <span className="text-[10px] text-[#6b7280] italic">
                              {new Date(n.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-[#4b5563] leading-relaxed">{n.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 bg-[#f3f4f6] rounded-xl flex items-center justify-center mb-3">
                      <span className="text-2xl">📝</span>
                    </div>
                    <p className="text-sm font-medium text-[#6b7280]">No notes yet</p>
                    <p className="text-xs text-[#9ca3af] mt-1">Add your first note below</p>
                  </div>
                )}
              </div>
            </div>

            {/* Note Input Footer */}
            <div className="p-6 bg-white border-t border-[#e5e7eb] sticky bottom-0">
              <div className="relative group">
                <textarea
                  placeholder="Add a private note..."
                  rows="3"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSaveNote();
                  }}
                  className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-4 pr-12 text-sm text-[#111827] focus:outline-none focus:border-black/30 transition-all placeholder:text-[#9ca3af] resize-none hover:border-[#9ca3af]"
                />
                <button
                  onClick={handleSaveNote}
                  disabled={isSubmitting || !note.trim()}
                  className="absolute bottom-4 right-4 p-2.5 bg-[#000000] text-white rounded-lg shadow-lg shadow-black/10 hover:bg-[#222222] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <AiOutlineSend size={18} />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-[#9ca3af] mt-2 text-right">Ctrl+Enter to submit</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideDrawer;
