import React from 'react';
import { SlideOver } from './SlideOver';
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

export function AlertDetailsSlideOver({ isOpen, onClose, alert }: { isOpen: boolean, onClose: () => void, alert: any }) {
  if (!alert) return null;

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Alerta"
      description="Revisa la información completa y toma acción."
    >
      <div className="mt-4 space-y-6">
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
          <div className="flex items-center mb-2">
            {alert.type === 'CRÍTICO' && <AlertTriangle className="w-5 h-5 text-rose-500 mr-2" />}
            {alert.type === 'ALTO' && <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />}
            {alert.type === 'MEDIO' && <Info className="w-5 h-5 text-amber-500 mr-2" />}
            <span className={`text-sm font-bold uppercase ${
              alert.type === 'CRÍTICO' ? 'text-rose-600' :
              alert.type === 'ALTO' ? 'text-orange-600' :
              'text-amber-600'
            }`}>
              {alert.type}
            </span>
            <span className="ml-auto text-xs text-slate-500">{alert.date}</span>
          </div>
          <p className="text-slate-800 font-medium">{alert.message}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-800 mb-2 border-b border-slate-200 pb-2">Acciones Recomendadas</h4>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium text-sm hover:bg-teal-700">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Marcar como resuelta
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50">
              Escalar Alerta
            </button>
          </div>
        </div>
      </div>
    </SlideOver>
  );
}
