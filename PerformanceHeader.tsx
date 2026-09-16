import React from 'react';
import { DashboardData } from '../../types';
import { AlertCircle, Target, Users, CheckCircle2 } from 'lucide-react';

export function PerformanceHeader({ data, filters, setFilters }: { data: DashboardData, filters: any, setFilters: any }) {
  const ncs = data.nonConformities || [];
  const capas = data.capas || [];
  
  const filteredNCs = ncs.filter(nc => filters.standard === 'Integrado' || nc.standardIds?.includes(filters.standard));
  
  // A CAPA is relevant if it's attached to a relevant NC, or if standard is Integrado
  const filteredCAPAs = capas.filter(capa => {
    if (filters.standard === 'Integrado') return true;
    if (capa.nonConformityId) {
       const parentNC = ncs.find(n => n.id === capa.nonConformityId);
       return parentNC?.standardIds?.includes(filters.standard);
    }
    return true; // if not linked, show by default or implement a better rule
  });

  const openNCs = filteredNCs.filter(nc => nc.status !== 'Cerrada').length;
  const inProgressCAPAs = filteredCAPAs.filter(c => c.status !== 'Cerrada' && c.status !== 'Verificada').length;
  const overdueCAPAs = filteredCAPAs.filter(c => {
    if (c.status === 'Cerrada' || c.status === 'Verificada') return false;
    return new Date(c.dueDate) < new Date();
  }).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Desempeño y Mejora Continua</h1>
          <p className="text-sm text-slate-500 mt-1">Monitoreo del desempeño del equipo, gestión de no conformidades (NC) y CAPA.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
            value={filters.standard}
            onChange={(e) => setFilters({...filters, standard: e.target.value})}
          >
            <option value="Integrado">Integrado (27001 + 42001)</option>
            <option value="ISO/IEC 27001">ISO/IEC 27001:2022</option>
            <option value="ISO/IEC 42001">ISO/IEC 42001:2023</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">NC Abiertas</p>
            <p className="text-lg font-bold text-slate-900">{openNCs}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">CAPA en Progreso</p>
            <p className="text-lg font-bold text-slate-900">{inProgressCAPAs}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">CAPA Vencidas</p>
            <p className="text-lg font-bold text-red-600">{overdueCAPAs}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total NC Cerradas</p>
            <p className="text-lg font-bold text-slate-900">{filteredNCs.length - openNCs}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
