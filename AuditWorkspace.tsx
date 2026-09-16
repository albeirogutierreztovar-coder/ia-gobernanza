import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { AuditHeader } from '../components/audit/AuditHeader';
import { AuditPlanTab } from '../components/audit/AuditPlanTab';
import { AuditExecutionTab } from '../components/audit/AuditExecutionTab';
import { FindingsTab } from '../components/audit/FindingsTab';
import { CalendarDays, ClipboardCheck, AlertTriangle } from 'lucide-react';

type Tab = 'plan' | 'execution' | 'findings';

export function AuditWorkspace() {
  const { data, fetchData, loading, selectedStandard, setSelectedStandard } = useStore();
  const { currentOrgId } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('plan');
  
  const [filters, setFilters] = useState({
    standard: selectedStandard || 'Integrado',
  });

  useEffect(() => {
    if (filters.standard !== selectedStandard) {
      setSelectedStandard(filters.standard);
    }
  }, [filters.standard, selectedStandard, setSelectedStandard]);

  useEffect(() => {
    if (selectedStandard && selectedStandard !== filters.standard) {
      setFilters(prev => ({ ...prev, standard: selectedStandard }));
    }
  }, [selectedStandard]);

  useEffect(() => {
    if (currentOrgId && !data) fetchData(currentOrgId);
  }, [fetchData, currentOrgId]);

  if (loading || !data) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 flex flex-col h-full">
      <AuditHeader data={data} filters={filters} setFilters={setFilters} />

      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('plan')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'plan'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Plan de Auditorías</span>
          </button>
          
          <button
            onClick={() => setActiveTab('execution')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'execution'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Ejecución / Checklists</span>
          </button>

          <button
            onClick={() => setActiveTab('findings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'findings'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Registro de Hallazgos</span>
          </button>
        </nav>
      </div>

      <div className="flex-1 mt-6">
        {activeTab === 'plan' && <AuditPlanTab data={data} standard={filters.standard} />}
        {activeTab === 'execution' && <AuditExecutionTab data={data} standard={filters.standard} />}
        {activeTab === 'findings' && <FindingsTab data={data} standard={filters.standard} />}
      </div>
    </div>
  );
}
