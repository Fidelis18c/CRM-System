import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX, HiOutlineMail, HiOutlinePhone, HiOutlineCalendar } from 'react-icons/hi';
import { AiOutlineSend } from 'react-icons/ai';
import api from '../../services/api';
import Skeleton from '../ui/Skeleton';

const SideDrawer = ({ lead, isOpen, onClose, isLoading, onNoteAdded }) => {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!lead && !isLoading) return null;

  const handleSaveNote = async () => {
    if (!note.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await api.post(`/leads/${lead._id || lead.id}/notes`, { content: note });
      setNote('');
      if (onNoteAdded) onNoteAdded();
    } catch (err) {
      console.error('Failed to save note:', err);
      alert('Failed to save note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setIsSubmitting(true);
      await api.patch(`/leads/${lead._id || lead.id}/status`, { status: newStatus });
      if (onNoteAdded) onNoteAdded(); // Refresh lead details
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                      <h2 className="text-xl font-bold text-[#111827] leading-tight text-black">{lead?.name}</h2>
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
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-white">
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-widest">Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-[#f9fafb] rounded-xl border border-[#e5e7eb] group hover:border-[#111827]/20 transition-colors">
                    <div className="flex items-center space-x-3">
                      <HiOutlineMail className="text-[#9ca3af] group-hover:text-[#111827] transition-colors" size={20} />
                      <span className="text-sm text-[#111827] font-medium">{isLoading ? <Skeleton className="h-4 w-40" /> : lead?.email}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-[#f9fafb] rounded-xl border border-[#e5e7eb] group hover:border-[#111827]/20 transition-colors">
                    <div className="flex items-center space-x-3">
                      <HiOutlineCalendar className="text-[#9ca3af] group-hover:text-[#111827] transition-colors" size={20} />
                      <span className="text-sm text-[#111827] font-medium">
                        {isLoading ? <Skeleton className="h-4 w-32" /> : `Created on ${new Date(lead?.createdAt || lead?.date).toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="space-y-4">
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

              {/* Timeline/Notes */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-widest">Activity History</h3>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                  </div>
                ) : (
                  <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#e5e7eb]">
                    {lead?.notes?.length > 0 ? (
                      lead.notes.map((note, i) => (
                        <div key={note._id || i} className="relative pl-8">
                          <div className="bg-[#f9fafb] p-4 rounded-xl border border-[#e5e7eb]">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-[#111827]">Admin</span>
                              <span className="text-[10px] text-[#6b7280] italic">
                                {new Date(note.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-[#4b5563] leading-relaxed">
                              {note.content}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#9ca3af] italic ml-8">No notes yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Input Footer */}
            <div className="p-6 bg-white border-t border-[#e5e7eb] sticky bottom-0">
              <div className="relative group">
                <textarea
                  placeholder="Add a private note..."
                  rows="3"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideDrawer;
