import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CommandCenter } from './pages/CommandCenter';
import { Implementation } from './pages/Implementation';
import { AIRegistry } from './pages/AIRegistry';
import { RiskHub } from './pages/RiskHub';
import { AlertCenter } from './pages/AlertCenter';
import { Governance } from './pages/Governance';
import { DocumentStudio } from './pages/DocumentStudio';
import { EvidenceVault } from './pages/EvidenceVault';
import { Login } from './pages/Login';
import { Performance } from './pages/Performance';
import { ControlCenter } from './pages/ControlCenter';
import { AuditWorkspace } from './pages/AuditWorkspace';
import { AuthProvider, useAuth } from './context/AuthContext';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
      <span className="text-2xl">🚧</span>
    </div>
    <h1 className="text-2xl font-bold text-slate-800 mb-2">{title}</h1>
    <p className="text-slate-500 max-w-md">
      Este módulo se encuentra en evolución. Su arquitectura de datos ya está contemplada en el diseño del sistema.
    </p>
  </div>
);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"></div></div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><CommandCenter /></ProtectedRoute>} />
          <Route path="/implementation" element={<ProtectedRoute><Implementation /></ProtectedRoute>} />
          <Route path="/governance" element={<ProtectedRoute><Governance /></ProtectedRoute>} />
          <Route path="/ai-registry" element={<ProtectedRoute><AIRegistry /></ProtectedRoute>} />
          <Route path="/risks" element={<ProtectedRoute><RiskHub /></ProtectedRoute>} />
          <Route path="/controls" element={<ProtectedRoute><ControlCenter /></ProtectedRoute>} />
          <Route path="/evidences" element={<ProtectedRoute><EvidenceVault /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><DocumentStudio /></ProtectedRoute>} />
          <Route path="/audit" element={<ProtectedRoute><AuditWorkspace /></ProtectedRoute>} />
          <Route path="/performance" element={<ProtectedRoute><Performance /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><PlaceholderPage title="Reporting Center" /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><PlaceholderPage title="Calendario" /></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><AlertCenter /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><PlaceholderPage title="Configuración" /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
