import React from 'react';
import { DashboardData } from '../../types';
import { Users, Plus } from 'lucide-react';

export function AIProvidersTab({ data }: { data: DashboardData }) {
  const providers = data.aiProviders || [];
  const aiSystems = data.aiSystems || [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
      <div className="flex justify-between items-center p-6 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Proveedores IA</h2>
          <p className="text-sm text-slate-500">Gestión de terceros, nubes y APIs de modelos de lenguaje.</p>
        </div>
        
        <button className="flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
          <Plus className="w-4 h-4 mr-2" />
          REGISTRAR PROVEEDOR
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        {providers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-4" />
            <p className="text-sm text-slate-500 mb-4">No hay proveedores registrados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map(prov => {
              const systemsUsing = aiSystems.filter(s => s.providerId === prov.id).length;
              return (
                <div key={prov.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 hover:border-teal-300 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-700 uppercase">
                      {prov.status || 'Activo'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      prov.riskRating === 'high' ? 'bg-rose-100 text-rose-700' :
                      prov.riskRating === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      Riesgo {prov.riskRating || 'low'}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800">{prov.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{prov.type} - {prov.service}</p>
                  
                  <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Sistemas que lo usan:</span>
                    <span className="font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">{systemsUsing}</span>
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
