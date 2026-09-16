import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { Map, Target, Briefcase, History, RefreshCcw } from 'lucide-react';

import { ImplementationHeader } from '../components/implementation/ImplementationHeader';
import { RoadmapTab } from '../components/implementation/RoadmapTab';
import { GapAssessmentTab } from '../components/implementation/GapAssessmentTab';
import { WorkPlanTab } from '../components/implementation/WorkPlanTab';
import { EvolutionTab } from '../components/implementation/EvolutionTab';

type Tab = 'roadmap' | 'gap' | 'plan' | 'evolution';

export function Implementation() {
  const { data, fetchData, loading, error, selectedStandard, setSelectedStandard } = useStore();
  const { currentOrgId } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('roadmap');
  
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
          <p className="mt-4 text-slate-500 font-medium">Cargando Módulo de Implementación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 flex flex-col h-full">
      <ImplementationHeader data={data} filters={filters} setFilters={setFilters} />

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'roadmap'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Map className="w-4 h-4 mr-2" />
            RUTA DE IMPLEMENTACIÓN
          </button>
          <button
            onClick={() => setActiveTab('gap')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'gap'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Target className="w-4 h-4 mr-2" />
            GAP ASSESSMENT
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'plan'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            PLAN DE TRABAJO
          </button>
          <button
            onClick={() => setActiveTab('evolution')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'evolution'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <History className="w-4 h-4 mr-2" />
            HISTORIAL Y EVOLUCIÓN
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 mt-6">
        {activeTab === 'roadmap' && <RoadmapTab data={data} standard={filters.standard} />}
        {activeTab === 'gap' && <GapAssessmentTab data={data} standard={filters.standard} onRefresh={() => currentOrgId && fetchData(currentOrgId)} />}
        {activeTab === 'plan' && <WorkPlanTab data={data} standard={filters.standard} />}
        {activeTab === 'evolution' && <EvolutionTab data={data} standard={filters.standard} />}
      </div>
    </div>
  );
}
