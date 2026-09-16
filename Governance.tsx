import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { RefreshCcw, LayoutDashboard, ListTree, Users, Shield, Target, Map } from 'lucide-react';
import { GovernanceHeader } from '../components/governance/GovernanceHeader';
import { ProcessMapTab } from '../components/governance/ProcessMapTab';
import { ProcessesTab } from '../components/governance/ProcessesTab';
import { StakeholdersTab } from '../components/governance/StakeholdersTab';
import { RolesTab } from '../components/governance/RolesTab';
import { ObjectivesTab } from '../components/governance/ObjectivesTab';
import { GovernanceMapTab } from '../components/governance/GovernanceMapTab';
import { HistoryTab } from '../components/governance/HistoryTab';

type Tab = 'processMap' | 'processes' | 'stakeholders' | 'roles' | 'objectives' | 'governanceMap' | 'history';

export function Governance() {
  const { data, fetchData, loading, error, selectedStandard, setSelectedStandard } = useStore();
  const { currentOrgId } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('processMap');
  
  const [filters, setFilters] = useState({
    standard: selectedStandard || 'Integrado',
  });

  // Sync back to store when standard changes
  useEffect(() => {
    if (filters.standard !== selectedStandard) {
      setSelectedStandard(filters.standard);
    }
  }, [filters.standard, selectedStandard, setSelectedStandard]);

  // Sync to local state if store changes elsewhere
  useEffect(() => {
    if (selectedStandard && selectedStandard !== filters.standard) {
      setFilters(prev => ({ ...prev, standard: selectedStandard }));
    }
  }, [selectedStandard]);
  
  useEffect(() => {
    if (currentOrgId && !data) fetchData(currentOrgId);
  }, [fetchData, currentOrgId]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
          <RefreshCcw className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">No pudimos cargar la información</h2>
        <p className="text-slate-500 mb-6 max-w-md text-center">{error}</p>
        <button 
          onClick={() => currentOrgId && fetchData(currentOrgId)}
          className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          REINTENTAR
        </button>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium">Cargando Gobernanza...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 flex flex-col h-full">
      <GovernanceHeader data={data} filters={filters} setFilters={setFilters} />

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {[
            { id: 'processMap', name: 'MAPA DE PROCESOS', icon: LayoutDashboard },
            { id: 'processes', name: 'PROCESOS', icon: ListTree },
            { id: 'stakeholders', name: 'PARTES INTERESADAS', icon: Users },
            { id: 'roles', name: 'ROLES Y RESPONS.', icon: Shield },
            { id: 'objectives', name: 'OBJETIVOS E IND.', icon: Target },
            { id: 'governanceMap', name: 'GOVERNANCE MAP', icon: Map },
            { id: 'history', name: 'HISTORIAL', icon: RefreshCcw }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 mt-6">
        {activeTab === 'processMap' && <ProcessMapTab data={data} />}
        {activeTab === 'processes' && <ProcessesTab data={data} />}
        {activeTab === 'stakeholders' && <StakeholdersTab data={data} standard={filters.standard} />}
        {activeTab === 'roles' && <RolesTab data={data} standard={filters.standard} />}
        {activeTab === 'objectives' && <ObjectivesTab data={data} standard={filters.standard} />}
        {activeTab === 'governanceMap' && <GovernanceMapTab data={data} />}
        {activeTab === 'history' && <HistoryTab data={data} />}
      </div>
    </div>
  );
}
