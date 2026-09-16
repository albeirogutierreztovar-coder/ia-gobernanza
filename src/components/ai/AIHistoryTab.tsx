import React from 'react';
import { DashboardData } from '../../types';
import { History } from 'lucide-react';

export function AIHistoryTab({ data }: { data: DashboardData }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center h-[600px] text-center p-6">
      <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
        <History className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">Historial de Trazabilidad (Audit Trail)</h3>
      <p className="text-slate-500 max-w-md mb-6">
        Aquí se registrarán inmutablemente todas las aprobaciones, cambios de modelo, datasets e incidentes por sistema.
      </p>
    </div>
  );
}
