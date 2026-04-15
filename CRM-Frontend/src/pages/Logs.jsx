import React, { useState, useEffect } from 'react';
import LogTimeline from '../components/logs/LogTimeline';
import { motion } from 'framer-motion';
import api from '../services/api';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: get recent leads (up to 20) to collect their IDs
        const leadsRes = await api.get('/leads', { params: { limit: 20, sort: 'newest' } });
        const leads = leadsRes.data.data || [];

        if (leads.length === 0) {
          setLogs([]);
          return;
        }

        // Step 2: fetch activities for each lead in parallel
        const activityRequests = leads.map((lead) =>
          api
            .get(`/leads/${lead._id || lead.id}/activities`)
            .then((res) => {
              const items = res.data.data || [];
              // Tag each activity with the lead name for display
              return items.map((act) => ({
                _id: act._id,
                message: act.details || act.action || 'Activity recorded',
                type: act.action
                  ? act.action.toLowerCase().includes('status')
                    ? 'status'
                    : act.action.toLowerCase().includes('note')
                    ? 'note'
                    : 'create'
                  : 'create',
                leadName: lead.name,
                createdAt: act.timestamp || act.createdAt,
              }));
            })
            .catch(() => []) // ignore errors for individual leads
        );

        const results = await Promise.all(activityRequests);

        // Step 3: flatten, sort by newest first, cap at 100 entries
        const allLogs = results
          .flat()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 100);

        setLogs(allLogs);
      } catch (err) {
        console.error('Failed to fetch activity logs:', err);
        setError('Could not load activity logs. Please try again.');
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

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="max-w-4xl">
        <LogTimeline logs={logs} loading={loading} />
      </div>
    </motion.div>
  );
};

export default Logs;
