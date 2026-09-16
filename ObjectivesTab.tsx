import React, { useState } from 'react';
import { DashboardData } from '../../types';
import { Plus, Target, Activity } from 'lucide-react';
import { SlideOver } from '../ui/SlideOver';
import { ObjectiveForm } from '../forms/ObjectiveForm';

export function ObjectivesTab({ data, standard = 'Integrado' }: { data: DashboardData, standard?: string }) {
  let objectives = data.objectives || [];
  
  if (standard !== 'Integrado') {
    objectives = objectives.filter(o => o.standardIds?.includes(standard));
  }
  
  const indicators = data.indicators || [];
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
      <div className="flex justify-between items-center p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">Objetivos e Indicadores</h2>
        
        <div className="flex space-x-3">
          <button onClick={() => alert("El módulo de Indicadores Independientes será habilitado en la próxima iteración.")} className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50">
            <Plus className="w-4 h-4 mr-2" /> CREAR INDICADOR
          </button>
          <button 
            onClick={() => setIsSlideOverOpen(true)}
            className="flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800"
          >
            <Plus className="w-4 h-4 mr-2" /> CREAR OBJETIVO
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        {objectives.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-slate-500 mb-4">No existen objetivos registrados.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {objectives.map(obj => {
              const objIndicators = indicators.filter(i => i.objectiveId === obj.id);
              return (
                <div key={obj.id} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center">
                      <Target className="w-5 h-5 text-teal-600 mr-3" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{obj.code}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            obj.status === 'on_track' ? 'bg-emerald-100 text-emerald-700' :
                            obj.status === 'at_risk' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {obj.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-800 mt-1">{obj.name}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-medium">Responsable</p>
                      <p className="text-sm text-slate-800">{obj.ownerId}</p>
                    </div>
                  </div>
                  
                  {objIndicators.length > 0 ? (
                    <div className="p-4 bg-white">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3 flex items-center">
                        <Activity className="w-3.5 h-3.5 mr-1" /> Indicadores Asociados
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {objIndicators.map(ind => (
                          <div key={ind.id} className="border border-slate-100 rounded-lg p-3 hover:border-teal-200 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-bold text-slate-400">{ind.code}</span>
                              <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Meta: {ind.target} {ind.unit}</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-800">{ind.name}</p>
                            <div className="mt-3 flex items-end justify-between">
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase">Actual</p>
                                <p className="text-lg font-bold text-teal-600">{ind.currentValue} <span className="text-xs font-normal">{ind.unit}</span></p>
                              </div>
                              <button className="text-xs font-semibold text-teal-600">Registrar Medición</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-white text-center text-sm text-slate-500">
                      Sin indicadores asociados
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <SlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        title="Crear Nuevo Objetivo"
        description="Establece los objetivos estratégicos para el Sistema de Gestión."
      >
        <ObjectiveForm 
          onSuccess={() => setIsSlideOverOpen(false)}
          onCancel={() => setIsSlideOverOpen(false)}
        />
      </SlideOver>
    </div>
  );
}
