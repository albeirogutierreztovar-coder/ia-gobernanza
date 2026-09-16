import React from 'react';
import { DashboardData } from '../../types';
import { Target, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

export function ObjectivesStatus({ data }: { data: DashboardData }) {
  const objectives = data.objectives || [];
  
  const statusCounts = {
    on_track: objectives.filter(o => o.status === 'on_track').length,
    at_risk: objectives.filter(o => o.status === 'at_risk').length,
    off_track: objectives.filter(o => o.status === 'off_track').length,
    completed: objectives.filter(o => o.status === 'completed').length,
    other: objectives.filter(o => ['draft', 'active', 'cancelled'].includes(o.status)).length,
  };

  const total = objectives.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Estado de los Objetivos</h2>
          <p className="text-sm text-slate-500">Métricas y cumplimiento</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
          <Target className="w-5 h-5 text-indigo-600" />
        </div>
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-slate-500">
          <Target className="w-8 h-8 text-slate-300 mb-2" />
          <p className="text-sm">No hay objetivos definidos</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <div className="flex items-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-3" />
              <span className="text-sm font-medium text-emerald-800">Completados / En Vía</span>
            </div>
            <span className="text-lg font-bold text-emerald-700">{statusCounts.completed + statusCounts.on_track}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-amber-600 mr-3" />
              <span className="text-sm font-medium text-amber-800">En Riesgo</span>
            </div>
            <span className="text-lg font-bold text-amber-700">{statusCounts.at_risk}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg border border-rose-100">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-rose-600 mr-3" />
              <span className="text-sm font-medium text-rose-800">Desviados</span>
            </div>
            <span className="text-lg font-bold text-rose-700">{statusCounts.off_track}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-slate-500 mr-3" />
              <span className="text-sm font-medium text-slate-700">En Planificación (Draft/Activo)</span>
            </div>
            <span className="text-lg font-bold text-slate-700">{statusCounts.other}</span>
          </div>
        </div>
      )}
    </div>
  );
}
