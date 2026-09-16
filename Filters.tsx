import React from 'react';
import { Filter, Calendar, MapPin, Building2, User, RefreshCcw } from 'lucide-react';

export function GlobalFilters({ filters, setFilters }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center gap-4 text-sm">
      <div className="flex items-center text-slate-500 font-medium">
        <Filter className="w-4 h-4 mr-2" />
        Filtros:
      </div>
      
      <select 
        className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
        value={filters.standard}
        onChange={(e) => setFilters({...filters, standard: e.target.value})}
      >
        <option value="Integrado">Norma: Integrado</option>
        <option value="ISO/IEC 27001">ISO/IEC 27001</option>
        <option value="ISO/IEC 42001">ISO/IEC 42001</option>
      </select>

      <select className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500">
        <option>Sede: Global</option>
        <option>Sede: Bogotá</option>
      </select>

      <select className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500">
        <option>Proceso: Todos</option>
        <option>TI</option>
        <option>Gerencia</option>
      </select>

      <select className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500">
        <option>Periodo: Actual</option>
        <option>Q3 2026</option>
        <option>Q2 2026</option>
      </select>

      <label className="flex items-center ml-auto text-slate-600">
        <input type="checkbox" className="mr-2 rounded text-teal-600 focus:ring-teal-500 border-slate-300" checked={filters.compare} onChange={(e) => setFilters({...filters, compare: e.target.checked})} />
        Comparar con periodo anterior
      </label>
    </div>
  );
}
