import React from 'react';
import { SlideOver } from './SlideOver';
import { ShieldAlert, Target } from 'lucide-react';

export function RiskDetailsSlideOver({ isOpen, onClose, risk }: { isOpen: boolean, onClose: () => void, risk: any }) {
  if (!risk) return null;

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Riesgo"
      description={`ID: ${risk.id.toUpperCase()} | ${risk.type}`}
    >
      <div className="mt-4 space-y-6">
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-800 mb-2">{risk.name}</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <span className="block text-xs font-medium text-slate-500 mb-1">Nivel Inherente</span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                risk.level === 'Crítico' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                risk.level === 'Alto' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                risk.level === 'Medio' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {risk.level}
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500 mb-1">Estado</span>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  risk.status === 'Tratado' ? 'bg-emerald-500' :
                  risk.status === 'Aceptado' ? 'bg-amber-500' :
                  'bg-rose-500'
                }`} />
                <span className="text-sm font-medium text-slate-700">{risk.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-800 mb-2 border-b border-slate-200 pb-2">Plan de Tratamiento</h4>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="shrink-0 mt-0.5">
                <Target className="w-4 h-4 text-slate-400 mr-2" />
              </div>
              <div>
                <p className="text-sm text-slate-800">No hay plan de tratamiento registrado para este riesgo todavía.</p>
                <button className="mt-2 text-xs font-medium text-teal-600 hover:text-teal-700 border border-teal-200 rounded px-2 py-1">
                  Añadir Acción de Tratamiento
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideOver>
  );
}
