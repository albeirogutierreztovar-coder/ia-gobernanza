import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { AlertDetailsSlideOver } from '../components/ui/AlertDetailsSlideOver';

export function AlertCenter() {
  const { data, fetchData, loading } = useStore();
  const { currentOrgId } = useAuth();
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  useEffect(() => {
    if (currentOrgId) fetchData(currentOrgId);
  }, [fetchData, currentOrgId]);

  if (loading || !data) return <div className="flex items-center justify-center h-full"><div className="animate-pulse flex flex-col items-center"><div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div><p className="mt-4 text-slate-500 font-medium">Cargando Alertas...</p></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Alert Center</h1>
          <p className="text-sm text-slate-500 mt-1">Centro de notificaciones y acciones requeridas para el mantenimiento del sistema.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">Todas</button>
            <button className="px-3 py-1.5 bg-transparent text-sm font-medium text-slate-600 hover:text-slate-900">No leídas (3)</button>
          </div>
          <button onClick={() => alert("Función de marcado masivo en desarrollo.")} className="text-sm font-medium text-teal-600 hover:text-teal-800">
            Marcar todas como leídas
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {data.alerts.map((alert) => (
            <div key={alert.id} className="p-5 hover:bg-slate-50 transition-colors flex items-start group">
              <div className="mt-0.5 shrink-0 mr-4">
                {alert.type === 'CRÍTICO' && <AlertTriangle className="w-6 h-6 text-rose-500" />}
                {alert.type === 'ALTO' && <AlertCircle className="w-6 h-6 text-orange-500" />}
                {alert.type === 'MEDIO' && <Info className="w-6 h-6 text-amber-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    alert.type === 'CRÍTICO' ? 'text-rose-600' :
                    alert.type === 'ALTO' ? 'text-orange-600' :
                    'text-amber-600'
                  }`}>
                    {alert.type}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{alert.date}</span>
                </div>
                <p className="text-slate-800 font-medium leading-snug">{alert.message}</p>
                
                <div className="mt-3 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="inline-flex items-center text-xs font-medium text-teal-600 hover:text-teal-800 mr-4"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    Ver Detalles
                  </button>
                  <button className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-700">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Resolver
                  </button>
                </div>
              </div>
              <div className="shrink-0 ml-4">
                <div className="w-2.5 h-2.5 bg-teal-500 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <AlertDetailsSlideOver
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        alert={selectedAlert}
      />
    </div>
  );
}
