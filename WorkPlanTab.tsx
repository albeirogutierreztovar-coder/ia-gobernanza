import React, { useState } from 'react';
import { DashboardData } from '../../types';
import { Calendar, User, AlertCircle, CheckCircle2, Search, Filter } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { CreateActionModal } from './CreateActionModal';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store/useStore';

const priorityColors: Record<string, string> = {
  'CRÍTICA': 'bg-rose-100 text-rose-700 border-rose-200',
  'ALTA': 'bg-orange-100 text-orange-700 border-orange-200',
  'MEDIA': 'bg-amber-100 text-amber-700 border-amber-200',
  'BAJA': 'bg-slate-100 text-slate-600 border-slate-200'
};

const statusColors: Record<string, string> = {
  'PENDIENTE': 'bg-slate-100 text-slate-600',
  'EN PROGRESO': 'bg-blue-100 text-blue-700',
  'BLOQUEADA': 'bg-rose-100 text-rose-700',
  'EN REVISIÓN': 'bg-purple-100 text-purple-700',
  'COMPLETADA': 'bg-emerald-100 text-emerald-700',
  'VENCIDA': 'bg-rose-50 text-rose-600 border border-rose-200'
};

export function WorkPlanTab({ data, standard }: { data: DashboardData, standard: string }) {
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [showModal, setShowModal] = useState(false);
  const actions = data.implementationActions || [];
  const { currentOrgId } = useAuth();
  const { fetchData } = useStore();

  const gaps = (data.requirementAssessments || []).filter(r => r.status === 'gap');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm min-h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Plan de Trabajo</h2>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar acción..." 
              className="pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-64"
            />
          </div>
          
          <button className="flex items-center px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </button>

          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${view === 'list' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
              onClick={() => setView('list')}
            >
              Lista
            </button>
            <button 
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${view === 'kanban' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
              onClick={() => setView('kanban')}
            >
              Kanban
            </button>
          </div>
          
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors ml-4"
          >
            CREAR PLAN DESDE BRECHAS
          </button>
        </div>
      </div>

      {actions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
          <span className="text-4xl mb-4">📋</span>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No hay acciones registradas</h3>
          <p className="text-sm text-slate-500 max-w-sm">Convierta las brechas identificadas en el Gap Assessment en acciones concretas.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          {view === 'list' ? (
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 font-medium w-1/3">Acción</th>
                  <th className="px-4 py-3 font-medium">Prioridad</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Responsable</th>
                  <th className="px-4 py-3 font-medium">Vencimiento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {actions.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50 cursor-pointer">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-800">{a.title}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{a.description}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${priorityColors[a.priority] || priorityColors['MEDIA']}`}>
                        {a.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${statusColors[a.status] || statusColors['PENDIENTE']}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center text-slate-600">
                        <User className="w-4 h-4 mr-2 text-slate-400" />
                        {a.ownerId}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center text-slate-600">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        {a.dueDate ? format(parseISO(a.dueDate), 'dd MMM yyyy', { locale: es }) : 'Sin fecha'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex space-x-4 overflow-x-auto pb-4 h-full">
              {['PENDIENTE', 'EN PROGRESO', 'EN REVISIÓN', 'COMPLETADA'].map(status => {
                const columnActions = actions.filter(a => a.status === status || (status === 'PENDIENTE' && a.status === 'VENCIDA'));
                return (
                  <div key={status} className="flex-none w-80 bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-slate-700 text-sm">{status}</h3>
                      <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{columnActions.length}</span>
                    </div>
                    <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                      {columnActions.map(a => (
                        <div key={a.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-teal-300 cursor-pointer">
                          <div className="flex justify-between items-start mb-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${priorityColors[a.priority]}`}>
                              {a.priority}
                            </span>
                            {a.status === 'VENCIDA' && <AlertCircle className="w-4 h-4 text-rose-500" />}
                            {a.status === 'COMPLETADA' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          </div>
                          <h4 className="text-sm font-semibold text-slate-800 mb-1">{a.title}</h4>
                          <div className="flex justify-between items-center mt-4 text-xs text-slate-500">
                            <span className="flex items-center truncate max-w-[100px]"><User className="w-3 h-3 mr-1" /> {a.ownerId}</span>
                            <span className="flex items-center whitespace-nowrap"><Calendar className="w-3 h-3 mr-1" /> {a.dueDate ? format(parseISO(a.dueDate), 'dd MMM', { locale: es }) : '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      
      {showModal && (
        <CreateActionModal 
          onClose={() => setShowModal(false)} 
          gaps={gaps} 
          onRefresh={() => currentOrgId && fetchData(currentOrgId)} 
        />
      )}
    </div>
  );
}
