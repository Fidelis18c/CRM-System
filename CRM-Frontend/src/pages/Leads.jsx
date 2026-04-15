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
  const [sortBy, setSortBy] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        sort: sortBy,
      };
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;

      const response = await api.get('/leads', { params });

      const leadsData = response.data.data || [];
      const count = response.data.count || 0;

      setLeads(leadsData);
      setTotalLeads(count);
      setTotalPages(Math.ceil(count / 10) || 1);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
      setError('Could not load leads. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, sortBy, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchLeads]);

  const refreshLeadDetails = useCallback(async (lead) => {
    if (!lead) return;
    const leadId = lead._id || lead.id;
    if (!leadId) return;
    try {
      setIsDetailsLoading(true);

      // Fetch lead details AND dedicated notes endpoint in parallel.
      // The backend may not embed notes inside GET /leads/:id, so we
      // always call GET /leads/:id/notes as the authoritative source.
      const [detailsRes, notesRes] = await Promise.allSettled([
        api.get(`/leads/${leadId}`),
        api.get(`/leads/${leadId}/notes`),
      ]);

      // Resolve lead object
      let leadObj = lead; // fallback to the stub row clicked
      if (detailsRes.status === 'fulfilled') {
        const data = detailsRes.value.data.data;
        if (data && data.lead) {
          leadObj = data.lead;
        } else if (data) {
          leadObj = data;
        }
      }

      // Resolve notes — dedicated endpoint wins
      let notes = leadObj.notes || [];
      if (notesRes.status === 'fulfilled') {
        const noteData = notesRes.value.data.data || notesRes.value.data;
        if (Array.isArray(noteData)) notes = noteData;
      }

      setSelectedLead({ ...leadObj, notes });
    } catch (err) {
      console.error('Failed to fetch lead details:', err);
    } finally {
      setIsDetailsLoading(false);
    }
  }, []);

  const handleLeadClick = async (lead) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
    await refreshLeadDetails(lead);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleSort = (value) => {
    setSortBy(value);
    setPage(1);
  };

  const handleFilter = (status) => {
    setStatusFilter(status);
    setPage(1);
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
        onSort={handleSort}
        onFilter={handleFilter}
        currentSort={sortBy}
        currentFilter={statusFilter}
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
        onNoteAdded={() => refreshLeadDetails(selectedLead)}
      />
    </motion.div>
  );
};

export default Leads;
