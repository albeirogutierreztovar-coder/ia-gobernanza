import React, { useState } from 'react';
import { DashboardData, CAPAStatus } from '../../types';
import { Plus, Search, CheckCircle2, LayoutGrid, List } from 'lucide-react';
import { format } from 'date-fns';
import { SlideOver } from '../ui/SlideOver';
import { CAPAForm } from '../forms/CAPAForm';

export function CAPATab({ data, standard }: { data: DashboardData, standard?: string }) {
  const capas = data.capas || [];
  const ncs = data.nonConformities || [];
  
  const filteredCAPAs = capas.filter(capa => {
    if (standard === 'Integrado') return true;
    if (capa.nonConformityId) {
       const parentNC = ncs.find(n => n.id === capa.nonConformityId);
       return parentNC?.standardIds?.includes(standard!);
    }
    return true; 
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const [searchTerm, setSearchTerm] = useState('');
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');

  const displayCAPAs = filteredCAPAs.filter(capa => 
    capa.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    capa.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const kanbanColumns: { id: CAPAStatus; label: string; color: string }[] = [
    { id: 'Planeada', label: 'Planeada', color: 'border-slate-300 bg-slate-100 text-slate-800' },
    { id: 'En Progreso', label: 'En Progreso', color: 'border-blue-300 bg-blue-50 text-blue-800' },
    { id: 'Implementada', label: 'Implementada', color: 'border-purple-300 bg-purple-50 text-purple-800' },
    { id: 'Verificada', label: 'Verificada / Cerrada', color: 'border-emerald-300 bg-emerald-50 text-emerald-800' }
  ];

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar acciones..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex bg-slate-200 p-1 rounded-lg">
            <button 
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setViewMode('list')}
              title="Vista de Lista"
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setViewMode('kanban')}
              title="Vista Kanban"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={() => setIsSlideOverOpen(true)}
            className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Acción (CAPA)</span>
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
          {displayCAPAs.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-medium">Acción</th>
                  <th className="px-6 py-3 font-medium">Tipo</th>
                  <th className="px-6 py-3 font-medium">Responsable</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                  <th className="px-6 py-3 font-medium">Vencimiento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayCAPAs.map((capa) => (
                  <tr key={capa.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{capa.title}</p>
                      {capa.nonConformityId && (
                        <p className="text-xs text-slate-500 mt-1">
                          Ref NC: {ncs.find(n => n.id === capa.nonConformityId)?.title || 'Desconocida'}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                        {capa.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-medium uppercase">
                          {capa.ownerId.charAt(0)}
                        </div>
                        <span className="text-slate-700 text-xs font-medium">{capa.ownerId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                        capa.status === 'Cerrada' || capa.status === 'Verificada' ? 'bg-emerald-100 text-emerald-700' :
                        capa.status === 'En Progreso' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {capa.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium ${
                        new Date(capa.dueDate) < new Date() && capa.status !== 'Cerrada' && capa.status !== 'Verificada'
                          ? 'text-red-600 bg-red-50 px-2 py-1 rounded'
                          : 'text-slate-500'
                      }`}>
                        {format(new Date(capa.dueDate), 'MMM d, yyyy')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No se encontraron acciones preventivas/correctivas</p>
            </div>
          )}
        </div>
      ) : (
        /* Kanban View */
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex space-x-4 min-w-max h-full">
            {kanbanColumns.map(column => {
              const columnCapas = displayCAPAs.filter(c => 
                (column.id === 'Verificada' && (c.status === 'Verificada' || c.status === 'Cerrada')) ||
                c.status === column.id
              );
              
              return (
                <div key={column.id} className="w-80 flex flex-col bg-slate-50 rounded-xl border border-slate-200 overflow-hidden h-full">
                  <div className={`p-3 border-b-2 flex justify-between items-center ${column.color}`}>
                    <h3 className="font-bold text-sm tracking-wider uppercase">{column.label}</h3>
                    <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold">{columnCapas.length}</span>
                  </div>
                  
                  <div className="p-3 flex-1 overflow-y-auto space-y-3">
                    {columnCapas.map(capa => {
                      const isOverdue = new Date(capa.dueDate) < new Date() && capa.status !== 'Cerrada' && capa.status !== 'Verificada';
                      return (
                        <div key={capa.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow transition-shadow cursor-grab">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {capa.type}
                            </span>
                            {isOverdue && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                Vencido
                              </span>
                            )}
                          </div>
                          
                          <h4 className="font-bold text-slate-800 text-sm mb-1 leading-snug">{capa.title}</h4>
                          
                          {capa.nonConformityId && (
                            <p className="text-[10px] text-slate-500 mb-3 truncate">
                              Ref NC: {ncs.find(n => n.id === capa.nonConformityId)?.title || 'Desconocida'}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                            <div className="flex items-center" title={capa.ownerId}>
                              <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">
                                {capa.ownerId.charAt(0)}
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
                              {format(new Date(capa.dueDate), 'dd/MM/yyyy')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    
                    {columnCapas.length === 0 && (
                      <div className="p-4 text-center border-2 border-dashed border-slate-200 rounded-lg">
                        <p className="text-xs text-slate-400 font-medium">Sin acciones</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <SlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        title="Nueva Acción Correctiva / Preventiva (CAPA)"
        description="Establece un plan de acción con fechas límite y responsables para asegurar la mejora continua."
      >
        <CAPAForm 
          onSuccess={() => setIsSlideOverOpen(false)}
          onCancel={() => setIsSlideOverOpen(false)}
        />
      </SlideOver>
    </div>
  );
}
