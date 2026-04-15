import React from 'react';
import {
  HiOutlineUserAdd,
  HiOutlineRefresh,
  HiOutlineAnnotation,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';
import { motion } from 'framer-motion';
import Skeleton from '../ui/Skeleton';

const TYPE_CONFIG = {
  create: {
    Icon: HiOutlineUserAdd,
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    icon: 'text-blue-500',
    label: 'New Lead',
  },
  status: {
    Icon: HiOutlineRefresh,
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    icon: 'text-amber-500',
    label: 'Status Updated',
  },
  note: {
    Icon: HiOutlineAnnotation,
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    icon: 'text-emerald-500',
    label: 'Note Added',
  },
  default: {
    Icon: HiOutlineExclamationCircle,
    bg: 'bg-[#f9fafb]',
    border: 'border-[#e5e7eb]',
    icon: 'text-[#6b7280]',
    label: 'Activity',
  },
};

const LogTimeline = ({ logs = [], loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-[#e5e7eb] rounded-xl p-5 flex items-start space-x-4"
          >
            <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-14 text-center">
        <div className="w-14 h-14 bg-[#f3f4f6] rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📋</span>
        </div>
        <p className="text-[#111827] font-semibold text-sm">No activity logs yet</p>
        <p className="text-[#9ca3af] text-xs mt-1">
          Activity will appear here after leads are created or updated.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log, i) => {
        const config = TYPE_CONFIG[log.type] || TYPE_CONFIG.default;
        const { Icon } = config;

        return (
          <motion.div
            key={log._id || i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.5) }}
            className={`bg-white border ${config.border} rounded-xl p-5 flex items-start space-x-4 group hover:shadow-md transition-all duration-200`}
          >
            {/* Icon Badge */}
            <div
              className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}
            >
              <Icon className={config.icon} size={18} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#111827] leading-snug">
                    {log.message}
                  </p>
                  {log.leadName && (
                    <p className="text-xs text-[#6b7280] mt-0.5">
                      Lead:{' '}
                      <span className="font-semibold text-[#111827]">{log.leadName}</span>
                    </p>
                  )}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${config.bg} ${config.icon}`}
                >
                  {config.label}
                </span>
              </div>
              <p className="text-[11px] text-[#9ca3af] mt-2">
                {log.createdAt
                  ? new Date(log.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : '—'}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LogTimeline;
