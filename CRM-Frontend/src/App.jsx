import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Logs from './pages/Logs';

import Login from './pages/Login';

import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
          <Route path="/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
