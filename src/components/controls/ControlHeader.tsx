import React from 'react';
import { DashboardData } from '../../types';
import { ShieldCheck, BarChart3, AlertCircle } from 'lucide-react';

export function ControlHeader({ data, filters, setFilters }: { data: DashboardData, filters: any, setFilters: any }) {
  const controls = data.normativeControls || [];
  
  const filteredControls = controls.filter(c => filters.standard === 'Integrado' || c.standard === filters.standard);
  
  const totalControls = filteredControls.length;
  const applicableControls = filteredControls.filter(c => c.applicable).length;
  const implementedControls = filteredControls.filter(c => c.applicable && c.implementationStatus === 'Implementado').length;
  const inProgressControls = filteredControls.filter(c => c.applicable && c.implementationStatus === 'En Proceso').length;

  const implementationPercentage = applicableControls > 0 
    ? Math.round((implementedControls / applicableControls) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Control Center & SOA</h1>
          <p className="text-sm text-slate-500 mt-1">Declaración de Aplicabilidad, implementación y nivel de madurez de controles.</p>
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
          <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Controles</p>
            <p className="text-lg font-bold text-slate-900">{totalControls}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Controles Aplicables</p>
            <p className="text-lg font-bold text-blue-700">{applicableControls}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Implementados</p>
            <p className="text-lg font-bold text-emerald-700">{implementedControls} ({implementationPercentage}%)</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">En Proceso</p>
            <p className="text-lg font-bold text-amber-700">{inProgressControls}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
