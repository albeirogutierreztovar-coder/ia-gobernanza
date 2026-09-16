import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { calculateDashboardKPIs } from '../utils/calculations';
import { GlobalFilters } from '../components/dashboard/Filters';
import { KPIWidgets } from '../components/dashboard/KPIWidgets';
import { HealthWidgets } from '../components/dashboard/HealthWidgets';
import { ActionCenter } from '../components/dashboard/ActionCenter';
import { NormativeStatus } from '../components/dashboard/NormativeStatus';
import { MaturityDistribution } from '../components/dashboard/MaturityDistribution';
import { EvolutionChart } from '../components/dashboard/EvolutionChart';
import { ObjectivesStatus } from '../components/dashboard/ObjectivesStatus';
import { ActivityList } from '../components/dashboard/ActivityList';
import { RefreshCcw } from 'lucide-react';

export function CommandCenter() {
  const { data, fetchData, loading, error, selectedStandard, setSelectedStandard } = useStore();
  const { currentOrgId } = useAuth();
  
  const [filters, setFilters] = useState({
    standard: selectedStandard || 'Integrado',
    compare: true,
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
          <p className="mt-4 text-slate-500 font-medium">Cargando Command Center...</p>
        </div>
      </div>
    );
  }

  // Calculate KPIs dynamically
  const kpis = calculateDashboardKPIs(data, filters);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Command Center</h1>
          <p className="text-sm text-slate-500 mt-1">
            Índice interno de salud y preparación del sistema.
          </p>
        </div>
      </div>

      <GlobalFilters filters={filters} setFilters={setFilters} />
      
      <KPIWidgets kpis={kpis} compare={filters.compare} />
      
      <HealthWidgets data={data} standard={filters.standard} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ActionCenter data={data} />
        </div>
        <div className="lg:col-span-2">
          <NormativeStatus data={data} standard={filters.standard} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <MaturityDistribution kpis={kpis} />
        </div>
        <div className="lg:col-span-2">
          <EvolutionChart snapshots={data.healthSnapshots} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ObjectivesStatus data={data} />
        <ActivityList data={data} />
      </div>
    </div>
  );
}
