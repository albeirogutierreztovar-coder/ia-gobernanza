import React, { useState } from 'react';
import { DashboardData } from '../../types';
import { normativeCatalog } from '../../data/catalog';
import { Search, Filter, AlertCircle } from 'lucide-react';
import { RequirementDrawer } from './RequirementDrawer';

const statusLabels: Record<string, string> = {
  not_evaluated: 'No evaluado',
  gap: 'Brecha',
  planned: 'Planeado',
  documented: 'Documentado',
  implemented: 'Implementado',
  evidenced: 'Implementado y evidenciado',
  implemented_maintained: 'Mantenido',
  verified: 'Verificado',
  not_applicable: 'No aplica'
};

const statusColors: Record<string, string> = {
  not_evaluated: 'bg-slate-100 text-slate-600',
  gap: 'bg-rose-100 text-rose-700',
  planned: 'bg-amber-100 text-amber-700',
  documented: 'bg-blue-100 text-blue-700',
  implemented: 'bg-teal-100 text-teal-700',
  evidenced: 'bg-teal-100 text-teal-700',
  implemented_maintained: 'bg-emerald-100 text-emerald-700',
  verified: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
  not_applicable: 'bg-slate-200 text-slate-500 line-through'
};

export function GapAssessmentTab({ data, standard, onRefresh }: { data: DashboardData, standard: string, onRefresh: () => void }) {
  const [view, setView] = useState<'cards' | 'matrix'>('matrix');
  const [selectedReq, setSelectedReq] = useState<any>(null);

  const baseCatalog = standard === 'Integrado' 
    ? normativeCatalog 
    : normativeCatalog.filter(c => c.standard === standard);

  // Merge catalog with assessments from Firestore
  const enrichedCatalog = baseCatalog.map(catReq => {
    const assessment = data.requirementAssessments.find(a => a.clause === catReq.clause && a.standard === catReq.standard);
    return {
      ...catReq,
      status: assessment ? assessment.status : 'not_evaluated',
      assessmentId: assessment?.id
    };
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm min-h-[500px] flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Gap Assessment</h2>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar requisito..." 
              className="pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-64"
            />
          </div>
          
          <button className="flex items-center px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </button>

          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${view === 'cards' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
              onClick={() => setView('cards')}
            >
              Cards
            </button>
            <button 
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${view === 'matrix' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
              onClick={() => setView('matrix')}
            >
              Matriz
            </button>
          </div>
        </div>
      </div>
      
      {view === 'matrix' && (
        <div className="flex-1 overflow-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 font-medium">Norma</th>
                <th className="px-4 py-3 font-medium">Req.</th>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enrichedCatalog.map((req, i) => (
                <tr key={i} className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => setSelectedReq(req)}>
                  <td className="px-4 py-3 text-slate-600 font-medium whitespace-nowrap">{req.standard.split(' ')[1]}</td>
                  <td className="px-4 py-3 text-slate-800 font-semibold">{req.requirement}</td>
                  <td className="px-4 py-3 text-slate-700 truncate max-w-md" title={req.title}>{req.title}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[req.status] || statusColors.not_evaluated}`}>
                      {statusLabels[req.status] || 'No evaluado'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {req.status === 'gap' && (
                      <span className="flex items-center text-rose-600 text-xs font-medium">
                        <AlertCircle className="w-3 h-3 mr-1" /> Requiere acción
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-4">
          {enrichedCatalog.map((req, i) => (
            <div key={i} onClick={() => setSelectedReq(req)} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-teal-300 transition-all cursor-pointer flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{req.standard.split(' ')[1]} • {req.requirement}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[req.status] || statusColors.not_evaluated}`}>
                  {statusLabels[req.status] || 'No evaluado'}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-800 mb-2">{req.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-3 mb-4 flex-1">{req.description}</p>
              
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400">Sin responsable</span>
                <button className="text-teal-600 font-medium hover:text-teal-700">Evaluar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedReq && <RequirementDrawer requirement={selectedReq} onClose={() => setSelectedReq(null)} onRefresh={onRefresh} />}
    </div>
  );
}
