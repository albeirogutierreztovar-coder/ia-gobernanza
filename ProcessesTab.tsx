import React, { useState } from 'react';
import { DashboardData, Process } from '../../types';
import { Search, Filter, Plus } from 'lucide-react';
import { ProcessWizard } from './ProcessWizard';
import { Process360View } from './Process360View';

export function ProcessesTab({ data }: { data: DashboardData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);

  const processes = (data.processes || []).filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.code && p.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.ownerId && p.ownerId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const translateCategory = (cat?: string) => {
    switch(cat) {
      case 'strategic': return 'Estratégico';
      case 'mission': return 'Misional';
      case 'support': return 'Apoyo';
      case 'control': return 'Control';
      default: return 'No definido';
    }
  };

  if (showWizard) {
    return <ProcessWizard onClose={() => setShowWizard(false)} />;
  }

  if (selectedProcess) {
    return <Process360View process={selectedProcess} data={data} onClose={() => setSelectedProcess(null)} />;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
      <div className="flex justify-between items-center p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">Listado de Procesos</h2>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar proceso..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-64"
            />
          </div>
          
          <button onClick={() => alert("La función de filtros está en desarrollo.")} className="flex items-center px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </button>
          
          <button 
            onClick={() => setShowWizard(true)}
            className="flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            CREAR PROCESO
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 font-medium">Código</th>
              <th className="px-6 py-3 font-medium">Proceso</th>
              <th className="px-6 py-3 font-medium">Categoría</th>
              <th className="px-6 py-3 font-medium">Responsable</th>
              <th className="px-6 py-3 font-medium">Criticidad</th>
              <th className="px-6 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {processes.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => setSelectedProcess(p)}>
                <td className="px-6 py-3 font-medium text-slate-600">{p.code || '-'}</td>
                <td className="px-6 py-3 font-bold text-slate-800">{p.name}</td>
                <td className="px-6 py-3 text-slate-600">{translateCategory(p.category)}</td>
                <td className="px-6 py-3 text-slate-600">{p.ownerId || 'Sin asignar'}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${
                    p.criticality === 'critical' ? 'bg-rose-100 text-rose-700' :
                    p.criticality === 'high' ? 'bg-orange-100 text-orange-700' :
                    p.criticality === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {p.criticality || 'low'}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-700 uppercase">
                    {p.status === 'active' ? 'Activo' : p.status || 'Borrador'}
                  </span>
                </td>
              </tr>
            ))}
            {processes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No se encontraron procesos que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
