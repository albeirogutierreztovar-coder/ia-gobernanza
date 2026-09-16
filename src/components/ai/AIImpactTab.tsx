import React, { useState } from 'react';
import { DashboardData } from '../../types';
import { ShieldAlert, Plus } from 'lucide-react';

export function AIImpactTab({ data }: { data: DashboardData }) {
  const impacts = data.aiImpactAssessments || [];
  const aiSystems = data.aiSystems || [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
      <div className="flex justify-between items-center p-6 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Evaluaciones de Impacto (AIA)</h2>
          <p className="text-sm text-slate-500">Evaluación de impactos sobre personas, grupos y sociedad.</p>
        </div>
        
        <button className="flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
          <Plus className="w-4 h-4 mr-2" />
          NUEVA EVALUACIÓN
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        {impacts.length === 0 ? (
          <div className="text-center py-12">
            <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto mb-4" />
            <p className="text-sm text-slate-500 mb-4">No hay evaluaciones de impacto registradas.</p>
            <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg">INICIAR EVALUACIÓN</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {impacts.map(imp => {
              const sys = aiSystems.find(s => s.id === imp.aiSystemId);
              return (
                <div key={imp.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 hover:border-teal-300 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-700 uppercase">
                      {imp.status || 'Completada'}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800">{sys?.name || 'Sistema Desconocido'}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{imp.purpose}</p>
                  
                  <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="block text-slate-400">Privacidad</span>
                      <span className={`font-semibold ${imp.privacyImpact === 'High' ? 'text-rose-600' : 'text-slate-700'}`}>{imp.privacyImpact || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Equidad</span>
                      <span className={`font-semibold ${imp.fairnessImpact === 'High' ? 'text-rose-600' : 'text-slate-700'}`}>{imp.fairnessImpact || '-'}</span>
                    </div>
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
