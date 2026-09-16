import React from 'react';
import { DashboardData } from '../../types';
import { RefreshCcw, User } from 'lucide-react';

export function HistoryTab({ data }: { data: DashboardData }) {
  const history = data.processHistory || [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">Historial de Gobernanza (Audit Trail)</h2>
      </div>
      <div className="flex-1 overflow-auto p-6">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCcw className="w-8 h-8 text-slate-300 mx-auto mb-4" />
            <p className="text-sm text-slate-500">No hay registros en el historial de procesos aún.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div key={item.id || index} className="flex space-x-4 p-4 border border-slate-100 rounded-lg bg-slate-50">
                <div className="shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-800">
                    <span className="font-semibold">{item.userName || item.userId}</span> {getActionText(item.action)} <span className="font-semibold">{item.entityType}</span> ({item.entityId})
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(item.date).toLocaleString()}</p>
                  
                  {item.field && (
                    <div className="mt-2 text-xs bg-white p-2 border border-slate-200 rounded">
                      <span className="font-semibold">{item.field}:</span> 
                      <span className="line-through text-rose-500 mx-2">{item.oldValue || 'vacío'}</span> 
                      <span>→</span>
                      <span className="text-emerald-600 ml-2">{item.newValue || 'vacío'}</span>
                    </div>
                  )}
                  {item.comment && (
                    <p className="text-xs text-slate-600 mt-2 italic">"{item.comment}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getActionText(action: string) {
  switch (action) {
    case 'create': return 'creó';
    case 'update': return 'actualizó';
    case 'delete': return 'eliminó';
    case 'approve': return 'aprobó';
    case 'version_change': return 'cambió la versión de';
    default: return 'modificó';
  }
}
