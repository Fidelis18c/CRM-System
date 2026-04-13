import React, { useState, useEffect } from 'react';
import LogTimeline from '../components/logs/LogTimeline';
import { motion } from 'framer-motion';
import api from '../services/api';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/logs');
        setLogs(response.data.logs || response.data);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Activity Logs Feed</h1>
        <p className="text-[#6b7280]">Track every system event and lead interaction in real-time.</p>
      </div>

      <div className="max-w-4xl">
        <LogTimeline logs={logs} loading={loading} />
      </div>
    </motion.div>
  );
};

export default Logs;
