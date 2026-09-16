import React, { useState } from 'react';
import { DashboardData } from '../../types';
import { Plus, Search, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { SlideOver } from '../ui/SlideOver';
import { AuditForm } from '../forms/AuditForm';

export function AuditPlanTab({ data, standard }: { data: DashboardData, standard?: string }) {
  const sessions = data.auditSessions || [];
  const filteredSessions = sessions.filter(s => standard === 'Integrado' || s.standard === standard);

  const [searchTerm, setSearchTerm] = useState('');
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  const displaySessions = filteredSessions.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.leadAuditor.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime());

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar auditoría..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsSlideOverOpen(true)}
          className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Programar Auditoría</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {displaySessions.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-3 font-medium">Auditoría</th>
                <th className="px-6 py-3 font-medium">Norma</th>
                <th className="px-6 py-3 font-medium">Auditor Líder</th>
                <th className="px-6 py-3 font-medium">Fecha Programada</th>
                <th className="px-6 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displaySessions.map((session) => (
                <tr key={session.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{session.title}</p>
                    <p className="text-xs text-slate-500">{session.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                      {session.standard}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-medium">
                        {session.leadAuditor.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-slate-700">{session.leadAuditor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {format(new Date(session.plannedDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      session.status === 'Completada' ? 'bg-emerald-100 text-emerald-700' :
                      session.status === 'En Progreso' ? 'bg-amber-100 text-amber-700' :
                      session.status === 'Cancelada' ? 'bg-slate-200 text-slate-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CalendarDays className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">No hay auditorías programadas</p>
            <p className="text-sm text-slate-400 mt-1">Programa tu primera revisión anual o auditoría interna.</p>
          </div>
        )}
      </div>

      <SlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        title="Programar Auditoría"
        description="Planifica una nueva sesión de auditoría interna, externa o revisión por la dirección."
      >
        <AuditForm 
          onSuccess={() => setIsSlideOverOpen(false)}
          onCancel={() => setIsSlideOverOpen(false)}
        />
      </SlideOver>
    </div>
  );
}
