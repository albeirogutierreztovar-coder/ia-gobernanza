import React, { useState } from 'react';
import { DashboardData } from '../../types';
import { SlideOver } from '../ui/SlideOver';
import { normativeCatalog } from '../../data/catalog';

export function NormativeStatus({ data, standard }: { data: DashboardData, standard: string }) {
  const clauses = ['4', '5', '6', '7', '8', '9', '10', 'Anexo A'];
  const [selectedClause, setSelectedClause] = useState<{clause: string, std: string} | null>(null);

  const getStatusColor = (clause: string, std: string) => {
    const reqs = data.requirementAssessments.filter(r => r.clause === clause && r.standard === std);
    if (reqs.length === 0) return 'bg-slate-200';
    
    // Simplistic mock logic for demo based on first requirement in clause
    const status = reqs[0].status;
    switch (status) {
      case 'verified':
      case 'implemented':
      case 'documented': return 'bg-teal-400';
      case 'planned': return 'bg-amber-400';
      case 'gap': return 'bg-rose-500';
      case 'not_evaluated': return 'bg-slate-300';
      default: return 'bg-slate-200';
    }
  };

  const getClauseDetails = () => {
    if (!selectedClause) return null;
    const { clause, std } = selectedClause;
    
    const reqs = data.requirementAssessments.filter(r => r.clause === clause && r.standard === std);
    const controls = data.normativeControls?.filter(c => c.standard === std && c.code.startsWith(clause + '.')) || [];
    
    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">Requisitos ({reqs.length})</h4>
          {reqs.length > 0 ? (
            <div className="space-y-3">
              {reqs.map(req => {
                const catalogReq = normativeCatalog.find(c => c.standard === req.standard && c.clause === req.clause && c.requirement === req.requirementId);
                const reqCode = `${req.standard} - ${req.clause}.${req.requirementId}`;
                const reqTitle = catalogReq?.title || 'Requisito de la norma';
                const reqDesc = catalogReq?.description || 'Detalle no disponible para este requisito.';
                return (
                <div key={req.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-900 text-sm">{reqCode}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      req.status === 'implemented' || req.status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                      req.status === 'gap' ? 'bg-rose-100 text-rose-700' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-sm block mb-1">{reqTitle}</span>
                    <p className="text-sm text-slate-600 leading-relaxed">{reqDesc}</p>
                  </div>
                </div>
              )})}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No hay requisitos mapeados en esta cláusula.</p>
          )}
        </div>
        
        {clause === 'Anexo A' || controls.length > 0 ? (
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">Controles Asociados ({controls.length})</h4>
            {controls.length > 0 ? (
              <div className="space-y-3">
                {controls.map(ctrl => (
                  <div key={ctrl.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900 text-sm">{ctrl.code}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                          ctrl.implementationStatus === 'Implementado' ? 'bg-emerald-100 text-emerald-700' :
                          ctrl.implementationStatus === 'En Proceso' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {ctrl.implementationStatus}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2" title={ctrl.name}>{ctrl.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No hay controles directos mapeados.</p>
            )}
          </div>
        ) : null}
      </div>
    );
  };

  const standards = standard === 'Integrado' ? ['ISO/IEC 27001', 'ISO/IEC 42001'] : [standard];

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Estado Normativo</h2>
        
        <div className="space-y-6">
          {standards.map(std => (
            <div key={std}>
              <h3 className="text-sm font-medium text-slate-600 mb-2">{std}</h3>
              
              <div className="flex space-x-1">
                {clauses.map(clause => (
                  <div 
                     key={clause} 
                     className={`flex-1 h-8 ${getStatusColor(clause, std)} rounded-sm cursor-pointer hover:opacity-80 transition-opacity relative group`}
                     onClick={() => setSelectedClause({ clause, std })}
                  >
                    <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-slate-800 text-white text-xs px-2 py-1 rounded z-10 shadow-lg">
                      Explorar Cláusula {clause}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-1 mt-1">
                {clauses.map(clause => (
                  <div key={clause} className="flex-1 text-center text-[10px] text-slate-500 font-medium">
                    {clause}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-center space-x-4 mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-500 flex-wrap gap-y-2">
          <div className="flex items-center"><div className="w-2 h-2 bg-emerald-500 rounded-sm mr-1"></div>Saludable</div>
          <div className="flex items-center"><div className="w-2 h-2 bg-teal-400 rounded-sm mr-1"></div>En progreso</div>
          <div className="flex items-center"><div className="w-2 h-2 bg-amber-400 rounded-sm mr-1"></div>Parcial</div>
          <div className="flex items-center"><div className="w-2 h-2 bg-rose-500 rounded-sm mr-1"></div>Brecha</div>
          <div className="flex items-center"><div className="w-2 h-2 bg-slate-300 rounded-sm mr-1"></div>No evaluado</div>
        </div>
      </div>

      <SlideOver
        isOpen={!!selectedClause}
        onClose={() => setSelectedClause(null)}
        title={`Cláusula ${selectedClause?.clause}`}
        description={`Norma: ${selectedClause?.std}`}
      >
        <div className="mt-2">
          {getClauseDetails()}
        </div>
      </SlideOver>
    </>
  );
}
