import React from 'react';
import { DashboardData } from '../../types';
import { Map, Activity, Users, ShieldAlert, Target, Settings, Database } from 'lucide-react';

export function GovernanceMapTab({ data }: { data: DashboardData }) {
  const processCount = data.processes?.length || 0;
  const stakeholderCount = data.stakeholders?.length || 0;
  const riskCount = data.risks?.length || 0;
  const objCount = data.objectives?.length || 0;
  const aiCount = data.aiSystems?.length || 0;
  const ncCount = data.auditItems?.filter(a => a.category === 'no_conformity')?.length || 0;

  const handleExport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      summary: {
        procesosBase: processCount,
        riesgosActivos: riskCount,
        sistemasIA: aiCount,
        partesInteresadas: stakeholderCount,
        objetivos: objCount,
        noConformidades: ncCount
      }
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mapa_Gobernanza_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Exportación completada. El archivo ha sido descargado.');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Mapa de Gobernanza Integrado</h2>
          <p className="text-sm text-slate-500 mt-1">
            Visualización general de la arquitectura de gestión y sus interconexiones.
          </p>
        </div>
        <button onClick={handleExport} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg shadow-sm hover:bg-slate-50 transition-colors flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Exportar Mapa (JSON)
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-8 bg-slate-50/50 flex flex-col items-center">
        
        {/* Core Node */}
        <div className="relative mb-16">
          <div className="w-32 h-32 bg-slate-900 rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-slate-800 z-10 relative">
            <Map className="w-8 h-8 text-white mb-1" />
            <span className="text-xs font-bold text-white tracking-widest uppercase">Núcleo</span>
            <span className="text-[10px] text-slate-400 uppercase mt-1">Gobernanza</span>
          </div>
          
          {/* Decorative rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-slate-200 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-dashed border-slate-200 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 w-full max-w-5xl">
          {/* Card 1: Procesos */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group hover:border-teal-400 transition-colors">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-center mt-3">
              <h3 className="font-bold text-slate-800 text-lg">{processCount}</h3>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Procesos Base</p>
              <div className="flex justify-between items-center text-xs bg-slate-50 p-2 rounded">
                <span className="text-slate-600">Estratégicos:</span>
                <span className="font-bold">{data.processes?.filter(p => p.category === 'strategic').length || 0}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Riesgos */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group hover:border-rose-400 transition-colors">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="text-center mt-3">
              <h3 className="font-bold text-slate-800 text-lg">{riskCount}</h3>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Riesgos Activos</p>
              <div className="flex justify-between items-center text-xs bg-slate-50 p-2 rounded">
                <span className="text-slate-600">Nivel Crítico:</span>
                <span className="font-bold text-rose-600">{data.risks?.filter(r => r.level === 'Crítico').length || 0}</span>
              </div>
            </div>
          </div>

          {/* Card 3: IA */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group hover:border-purple-400 transition-colors">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <Database className="w-4 h-4" />
            </div>
            <div className="text-center mt-3">
              <h3 className="font-bold text-slate-800 text-lg">{aiCount}</h3>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Sistemas IA</p>
              <div className="flex justify-between items-center text-xs bg-slate-50 p-2 rounded">
                <span className="text-slate-600">En Producción:</span>
                <span className="font-bold text-purple-600">{data.aiSystems?.filter(ai => ai.lifecycleStage === 'OPERATION').length || 0}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Stakeholders */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group hover:border-amber-400 transition-colors">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-center mt-3">
              <h3 className="font-bold text-slate-800 text-lg">{stakeholderCount}</h3>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Partes Interesadas</p>
              <div className="flex justify-between items-center text-xs bg-slate-50 p-2 rounded">
                <span className="text-slate-600">Externos:</span>
                <span className="font-bold text-amber-600">{data.stakeholders?.filter(s => s.internalExternal === 'External').length || 0}</span>
              </div>
            </div>
          </div>

          {/* Card 5: Objetivos */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group hover:border-emerald-400 transition-colors">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <Target className="w-4 h-4" />
            </div>
            <div className="text-center mt-3">
              <h3 className="font-bold text-slate-800 text-lg">{objCount}</h3>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Objetivos</p>
              <div className="flex justify-between items-center text-xs bg-slate-50 p-2 rounded">
                <span className="text-slate-600">En Riesgo:</span>
                <span className="font-bold text-rose-600">{data.objectives?.filter(o => o.status === 'at_risk').length || 0}</span>
              </div>
            </div>
          </div>

          {/* Card 6: Auditorías / NC */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group hover:border-slate-800 transition-colors">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <Settings className="w-4 h-4" />
            </div>
            <div className="text-center mt-3">
              <h3 className="font-bold text-slate-800 text-lg">{ncCount}</h3>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">No Conformidades</p>
              <div className="flex justify-between items-center text-xs bg-slate-50 p-2 rounded">
                <span className="text-slate-600">Abiertas:</span>
                <span className="font-bold text-slate-700">{data.auditItems?.filter(a => a.category === 'no_conformity' && a.status === 'open').length || 0}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
