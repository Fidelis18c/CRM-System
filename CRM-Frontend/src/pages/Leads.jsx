import React, { useState, useEffect, useCallback } from 'react';
import LeadTable from '../components/leads/LeadTable';
import LeadFilters from '../components/leads/LeadFilters';
import SideDrawer from '../components/layout/SideDrawer';
import { motion } from 'framer-motion';
import api from '../services/api';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/leads', {
        params: {
          page,
          search: searchTerm,
          limit: 10
        }
      });
      
      const leadsData = response.data.data || [];
      const count = response.data.count || 0;
      
      setLeads(leadsData);
      setTotalLeads(count);
      setTotalPages(Math.ceil(count / 10));
      setError(null);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
      setError('Could not load leads. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 300); // Small debounce for search

    return () => clearTimeout(timer);
  }, [fetchLeads]);

  const handleLeadClick = async (lead) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
    
    // Fetch full details and notes
    try {
      setIsDetailsLoading(true);
      const response = await api.get(`/leads/${lead._id || lead.id}`);
      setSelectedLead(response.data.data);
    } catch (err) {
      console.error('Failed to fetch lead details:', err);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1); // Reset to first page on search
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Leads Management</h1>
        <p className="text-[#6b7280]">Manage and track your customer pipelines efficiently.</p>
      </div>

      <LeadFilters 
        onSearch={handleSearch} 
        onSort={(val) => console.log('Sort by:', val)} 
      />

      {error ? (
        <div className="bg-red-50 border border-red-100 p-6 rounded-xl text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={fetchLeads} className="mt-4 text-sm font-bold underline text-red-700">Try Again</button>
        </div>
      ) : (
        <LeadTable 
          leads={leads} 
          onLeadClick={handleLeadClick} 
          loading={loading}
          currentPage={page}
          totalPages={totalPages}
          totalResults={totalLeads}
          onPageChange={handlePageChange}
        />
      )}

      <SideDrawer 
        lead={selectedLead} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        isLoading={isDetailsLoading}
        onNoteAdded={() => handleLeadClick(selectedLead)} // Refresh details when note added
      />
    </motion.div>
  );
};

export default Leads;
