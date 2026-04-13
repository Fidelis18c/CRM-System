import React from 'react';
import { HiOutlineUserAdd, HiOutlineRefresh, HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';
import { motion } from 'framer-motion';
import Skeleton from '../ui/Skeleton';

const LogTimeline = ({ logs = [], loading = false }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'create': return HiOutlineUserAdd;
      case 'status': return HiOutlineRefresh;
      case 'note': return HiOutlineCheckCircle;
      default: return HiOutlineExclamationCircle;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white border pl-4 border-[#e5e7eb] rounded-xl p-5 flex items-start space-x-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-10 text-center">
        <p className="text-[#6b7280] italic">No activity logs found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log, i) => {
        const Icon = getIcon(log.type);
        return (
          <motion.div
            key={log._id || log.id || i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border pl-4 border-[#e5e7eb] rounded-xl p-5 flex items-start space-x-4 group hover:shadow-md transition-all duration-300"
          >
            <div className="flex-1 min-w-0 py-1">
              <p className="text-sm font-semibold text-[#111827] group-hover:text-black transition-colors">{log.message}</p>
              <p className="text-xs text-[#6b7280] mt-1">
                {new Date(log.createdAt || log.timestamp).toLocaleString()}
              </p>
            </div>
            <button className="text-xs font-bold text-white bg-black hover:bg-[#222222] opacity-0 group-hover:opacity-100 transition-all px-4 py-2 rounded-lg">
              Details
            </button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LogTimeline;
