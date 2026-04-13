import React, { useState, useEffect } from 'react';
import StatCard from '../components/dashboard/StatCard';
import { DailyLeadVolume, StatusDistribution } from '../components/dashboard/ChartsContainer';
import { HiOutlineUserGroup, HiOutlineCheckCircle, HiOutlineClock, HiOutlineTrendingUp } from 'react-icons/hi';
import { motion } from 'framer-motion';
import api from '../services/api';
import { CardSkeleton, ChartSkeleton } from '../components/ui/Skeleton';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [analytics, setAnalytics] = useState({ dailyLeads: [], statusCounts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/leads/analytics');
        const { totalLeads, convertedLeads, conversionRate, statusCounts, dailyLeads } = response.data.data;
        
        // Find qualified/active leads count from statusCounts
        const contactedCount = statusCounts.find(s => s._id === 'CONTACTED')?.count || 0;
        const newCount = statusCounts.find(s => s._id === 'NEW')?.count || 0;

        setStats([
          { title: 'Total Leads', value: totalLeads.toLocaleString(), icon: HiOutlineUserGroup },
          { title: 'Contacted', value: contactedCount.toLocaleString(), icon: HiOutlineClock },
          { title: 'Converted', value: convertedLeads.toLocaleString(), icon: HiOutlineCheckCircle },
          { title: 'Conversion Rate', value: `${conversionRate}%`, icon: HiOutlineTrendingUp },
        ]);

        setAnalytics({
          dailyLeads: dailyLeads || [],
          statusCounts: statusCounts || []
        });
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-[#374151] tracking-tight">Dashboard Overview</h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Left: Status Distribution (40%) */}
        <div className="lg:col-span-4 bg-white border border-[#e5e7eb] rounded-xl p-6 relative group overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-[#111827] tracking-tight">Status Distribution</h3>
            <span className="text-xs font-bold text-[#6b7280] uppercase tracking-widest">Live View</span>
          </div>
          {loading ? <ChartSkeleton /> : <StatusDistribution data={analytics.statusCounts} />}
        </div>

        {/* Right: Daily Lead Volume (60%) */}
        <div className="lg:col-span-6 bg-white border border-[#e5e7eb] rounded-xl p-6 relative group overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-[#111827] tracking-tight">Daily Lead Volume</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#6b7280] uppercase tracking-widest">Last 7 Days</span>
            </div>
          </div>
          {loading ? <ChartSkeleton /> : <DailyLeadVolume data={analytics.dailyLeads} />}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
