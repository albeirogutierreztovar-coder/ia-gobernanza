import React from 'react';
import { DashboardData } from '../../types';
import { ClipboardCheck, PlayCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';

export function AuditExecutionTab({ data, standard }: { data: DashboardData, standard?: string }) {
  const sessions = data.auditSessions || [];
  
  // Show audits that are programmed or in progress
  const activeSessions = sessions.filter(s => 
    (standard === 'Integrado' || s.standard === standard) && 
    (s.status === 'Programada' || s.status === 'En Progreso')
  ).sort((a, b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime());

  return (
    <div className="space-y-6">
      {activeSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSessions.map(session => (
            <div key={session.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{session.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{session.standard} • {session.type}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  session.status === 'En Progreso' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {session.status}
                </span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Auditor:</span>
                  <span className="font-medium text-slate-700">{session.leadAuditor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Fecha:</span>
                  <span className="font-medium text-slate-700">{format(new Date(session.plannedDate), 'MMM d, yyyy')}</span>
                </div>
                {session.scope && (
                  <div>
                    <span className="text-slate-500 text-xs block mb-1">Alcance:</span>
                    <p className="text-sm font-medium text-slate-700 line-clamp-2" title={session.scope}>{session.scope}</p>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
                <button className="w-full flex items-center justify-center space-x-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors">
                  <PlayCircle className="w-4 h-4" />
                  <span>{session.status === 'En Progreso' ? 'Continuar Evaluación' : 'Iniciar Checklists'}</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                  <FileText className="w-4 h-4" />
                  <span>Ver Informe Preliminar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardCheck className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">No hay auditorías activas</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Actualmente no tienes auditorías programadas o en progreso para la norma seleccionada. Dirígete a la pestaña de "Plan de Auditorías" para programar una.
          </p>
        </div>
      )}
    </div>
  );
}
