import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { PerformanceHeader } from '../components/performance/PerformanceHeader';
import { NonConformitiesTab } from '../components/performance/NonConformitiesTab';
import { CAPATab } from '../components/performance/CAPATab';
import { TeamPerformanceTab } from '../components/performance/TeamPerformanceTab';
import { AlertCircle, FileCheck, Users, Activity } from 'lucide-react';

type Tab = 'nonConformities' | 'capa' | 'team';

export function Performance() {
  const { data, fetchData, loading, selectedStandard, setSelectedStandard } = useStore();
  const { currentOrgId } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('team');
  
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
      <PerformanceHeader data={data} filters={filters} setFilters={setFilters} />

      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('team')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'team'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Desempeño del Equipo</span>
          </button>
          
          <button
            onClick={() => setActiveTab('nonConformities')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'nonConformities'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>No Conformidades</span>
          </button>
          
          <button
            onClick={() => setActiveTab('capa')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'capa'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>CAPA (Acciones Correctivas)</span>
          </button>
        </nav>
      </div>

      <div className="flex-1 mt-6">
        {activeTab === 'team' && <TeamPerformanceTab data={data} standard={filters.standard} />}
        {activeTab === 'nonConformities' && <NonConformitiesTab data={data} standard={filters.standard} />}
        {activeTab === 'capa' && <CAPATab data={data} standard={filters.standard} />}
      </div>
    </div>
  );
}
