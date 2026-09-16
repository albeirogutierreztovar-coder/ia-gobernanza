import React from 'react';
import { DashboardData } from '../../types';
import { AlertTriangle } from 'lucide-react';

export function AIMonitoringTab({ data }: { data: DashboardData }) {
  const incidents = data.aiIncidents || [];
  const aiSystems = data.aiSystems || [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
      <div className="flex justify-between items-center p-6 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Incidentes y Monitoreo</h2>
          <p className="text-sm text-slate-500">Eventos de seguridad, alucinaciones o degradación de modelos.</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        {incidents.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto mb-4" />
            <p className="text-sm text-slate-500 mb-4">No hay incidentes abiertos.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incidents.map(inc => {
              const sys = aiSystems.find(s => s.id === inc.aiSystemId);
              return (
                <div key={inc.id} className="border border-rose-200 rounded-xl p-4 bg-rose-50 flex items-start">
                  <AlertTriangle className="w-5 h-5 text-rose-500 mt-0.5 mr-3 shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 uppercase mr-2">
                          {inc.severity}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-600 border border-slate-200 uppercase">
                          {inc.category}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-rose-600 uppercase">{inc.status}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 mt-2">{inc.description}</h3>
                    <p className="text-xs text-slate-600 mt-1">Sistema afectado: <span className="font-semibold">{sys?.name || 'Desconocido'}</span></p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
