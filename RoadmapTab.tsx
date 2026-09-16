import React, { useState } from 'react';
import { DashboardData } from '../../types';
import { Check, ChevronRight, Target, Shield, HelpCircle } from 'lucide-react';
import { clausesInfo, normativeCatalog } from '../../data/catalog';
import { SlideOver } from '../ui/SlideOver';

export function RoadmapTab({ data, standard }: { data: DashboardData, standard: string }) {
  const [mode, setMode] = useState<'guided' | 'expert'>('expert');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPhase, setSelectedPhase] = useState<any>(null);

  const baseCatalog = standard === 'Integrado' 
    ? normativeCatalog 
    : normativeCatalog.filter(c => c.standard === standard);

  const phases = clausesInfo.map((clause, index) => {
    const clauseCatalog = baseCatalog.filter(c => c.clause === clause.id);
    const total = clauseCatalog.length;
    
    let evalCount = 0;
    let gaps = 0;

    clauseCatalog.forEach(req => {
      const assessment = data.requirementAssessments.find(a => a.clause === req.clause && a.requirementId === req.requirement && a.standard === req.standard);
      if (assessment && assessment.status !== 'not_evaluated') {
        evalCount++;
        if (assessment.status === 'gap') gaps++;
      }
    });

    return {
      id: index + 1,
      name: clause.title,
      desc: clause.description,
      total,
      eval: evalCount,
      gaps
    };
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm min-h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Ruta de Implementación</h2>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${mode === 'guided' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setMode('guided')}
          >
            Modo Guiado
          </button>
          <button 
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${mode === 'expert' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setMode('expert')}
          >
            Modo Experto
          </button>
        </div>
      </div>
      
      {mode === 'guided' ? (
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full mt-4">
          <div className="flex items-center text-xs font-semibold text-teal-600 mb-4 tracking-wider uppercase">
            Paso {currentStep} de 8
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">Empecemos entendiendo su organización.</h3>
          <p className="text-slate-600 mb-8">¿Qué situaciones externas e internas pueden afectar su sistema de gestión?</p>
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
            <h4 className="text-sm font-medium text-slate-700 mb-4">Seleccione las categorías relevantes para su contexto:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Legal y regulatorio', 'Tecnológico', 'Mercado', 'Clientes', 'Proveedores', 'Ciberseguridad', 'Inteligencia Artificial', 'Social', 'Económico'].map(cat => (
                <label key={cat} className="flex items-center p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-teal-500 transition-colors">
                  <input type="checkbox" className="rounded text-teal-600 focus:ring-teal-500 border-slate-300 mr-3" />
                  <span className="text-sm text-slate-700">{cat}</span>
                </label>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between items-center text-xs text-slate-400">
              <span className="flex items-center"><HelpCircle className="w-4 h-4 mr-1" /> Relacionado con: ISO 27001 · 4.1 / ISO 42001 · 4.1</span>
            </div>
          </div>

          <div className="flex justify-between mt-auto pt-6 border-t border-slate-100">
            <button 
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-6 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button 
              onClick={() => setCurrentStep(prev => Math.min(prev + 1, 8))}
              className="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center"
            >
              Guardar y Continuar <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phases.map((phase) => {
            const progress = phase.total > 0 ? Math.round((phase.eval / phase.total) * 100) : 0;
            return (
              <div 
                key={phase.id} 
                className="border border-slate-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group bg-white"
                onClick={() => setSelectedPhase(phase)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold mr-3 group-hover:bg-teal-50 group-hover:text-teal-600 text-sm">
                      {phase.id}
                    </div>
                    <h4 className="text-base font-semibold text-slate-800 group-hover:text-teal-700">{phase.name}</h4>
                  </div>
                  {progress === 100 && <Check className="w-5 h-5 text-emerald-500" />}
                </div>
                
                <p className="text-sm text-slate-500 mb-5 min-h-[40px]">{phase.desc}</p>
                
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                  <span>{progress}% Completado</span>
                  <span>{phase.eval} / {phase.total} evaluados</span>
                </div>
                
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4 overflow-hidden">
                  <div 
                    className={`h-1.5 rounded-full ${progress === 100 ? 'bg-emerald-500' : progress > 0 ? 'bg-teal-500' : 'bg-slate-300'}`} 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${phase.gaps > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
                    {phase.gaps} brechas abiertas
                  </span>
                  <span className="text-teal-600 text-xs font-semibold uppercase tracking-wider group-hover:underline">
                    Explorar
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <SlideOver
        isOpen={!!selectedPhase}
        onClose={() => setSelectedPhase(null)}
        title={selectedPhase?.name || ''}
        description={selectedPhase?.desc || ''}
      >
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">Requisitos de la Fase</h4>
          <div className="space-y-3">
            {selectedPhase && baseCatalog.filter(c => c.clause === clausesInfo[selectedPhase.id - 1].id).map(req => {
              const assessment = data.requirementAssessments.find(a => a.clause === req.clause && a.requirementId === req.requirement && a.standard === req.standard);
              const status = assessment?.status || 'not_evaluated';
              return (
                <div key={`${req.standard}-${req.clause}-${req.requirement}`} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900 text-sm">{req.standard} - {req.clause}.{req.requirement}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      status === 'implemented' || status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                      status === 'gap' ? 'bg-rose-100 text-rose-700' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-bold text-slate-800 text-sm block mb-1">{req.title}</span>
                    <p className="text-sm text-slate-600" title={req.description}>{req.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SlideOver>
    </div>
  );
}
