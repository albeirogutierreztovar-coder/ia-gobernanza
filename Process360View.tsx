import React, { useState } from 'react';
import { DashboardData, Process } from '../../types';
import { ArrowLeft, Target, Activity, ShieldAlert, FileText, CheckCircle2, ChevronRight, Edit, Settings, Users, Link as LinkIcon, Database, CheckSquare } from 'lucide-react';
import { normativeCatalog } from '../../data/catalog';

export function Process360View({ process, data, onClose }: { process: Process, data: DashboardData, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('resumen');
  const [viewMode, setViewMode] = useState<'ejecutiva' | 'experta'>('ejecutiva');

  const translateCategory = (cat?: string) => {
    switch(cat) {
      case 'strategic': return 'Estratégico';
      case 'mission': return 'Misional';
      case 'support': return 'Apoyo';
      case 'control': return 'Control';
      default: return 'No definido';
    }
  };

  const getHealthStatus = () => {
    const score = process.criticality === 'critical' ? 82 : process.criticality === 'high' ? 75 : 95;
    if (score >= 80) return { label: 'Saludable', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', score };
    if (score >= 60) return { label: 'Aceptable', color: 'text-teal-600 bg-teal-50 border-teal-200', score };
    if (score >= 40) return { label: 'En Atención', color: 'text-amber-600 bg-amber-50 border-amber-200', score };
    return { label: 'Crítico', color: 'text-rose-600 bg-rose-50 border-rose-200', score };
  };

  const health = getHealthStatus();

  // Data for tabs
  const processInputs = (data.processInputs || []).filter(i => i.processId === process.id);
  const processOutputs = (data.processOutputs || []).filter(o => o.processId === process.id);
  const processActivities = (data.processActivities || []).filter(a => a.processId === process.id);
  const processDependencies = (data.processDependencies || []).filter(d => d.sourceProcessId === process.id || d.targetProcessId === process.id);
  const processAiSystems = (data.aiSystems || []).filter(ai => ai.process === process.name || ai.process === process.id);
  const processRequirements = (data.requirementAssessments || []).filter(r => r.processId === process.id);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[700px] overflow-hidden animate-in fade-in">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start">
            <button onClick={onClose} className="mr-4 text-slate-500 hover:text-slate-800 mt-1">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">{process.code || 'S/N'}</span>
                <span className="text-xs font-medium text-slate-500">{translateCategory(process.category)}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">{process.name}</h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">{process.objective || 'Sin objetivo definido.'}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className={`px-3 py-1.5 rounded-lg border ${health.color} flex flex-col items-center min-w-[100px]`}>
              <span className="text-xs font-bold uppercase">{health.label}</span>
              <span className="text-xl font-black">{health.score}%</span>
            </div>
            <button className="mt-2 text-xs font-semibold text-teal-600 flex items-center hover:text-teal-700">
              <Edit className="w-3 h-3 mr-1" /> EDITAR PROCESO
            </button>
          </div>
        </div>
        
        <div className="flex bg-slate-200/50 p-1 rounded-lg w-max self-end mt-2">
          <button 
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${viewMode === 'ejecutiva' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
            onClick={() => setViewMode('ejecutiva')}
          >
            VISTA EJECUTIVA
          </button>
          <button 
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${viewMode === 'experta' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
            onClick={() => setViewMode('experta')}
          >
            VISTA EXPERTA
          </button>
        </div>
      </div>

      {/* Internal Tabs */}
      <div className="border-b border-slate-200 px-6">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {[
            { id: 'resumen', name: 'RESUMEN 360' },
            { id: 'caracterizacion', name: 'CARACTERIZACIÓN' },
            { id: 'actividades', name: 'ACTIVIDADES' },
            { id: 'relaciones', name: 'RELACIONES' },
            { id: 'ai', name: 'SISTEMAS IA' },
            { id: 'iso', name: 'REQUISITOS ISO' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs tracking-wider transition-colors ${
                activeTab === tab.id
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        
        {/* RESUMEN */}
        {activeTab === 'resumen' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center"><Target className="w-3.5 h-3.5 mr-1" /> OBJETIVOS FUERA DE META</p>
                <p className="text-2xl font-bold text-slate-800">0</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center"><ShieldAlert className="w-3.5 h-3.5 mr-1" /> RIESGOS CRÍTICOS</p>
                <p className="text-2xl font-bold text-rose-600">1</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> IMPLEMENTACIÓN ISO</p>
                <p className="text-2xl font-bold text-slate-800">76%</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center"><FileText className="w-3.5 h-3.5 mr-1" /> ACCIONES ABIERTAS</p>
                <p className="text-2xl font-bold text-amber-600">3</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Top Prioridades del Proceso</h3>
              <ul className="space-y-3">
                <li className="flex items-start text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 mr-3 shrink-0"></span>
                  <span className="text-slate-600">Riesgo <strong className="text-slate-800">R-023 (Fuga de datos)</strong> necesita tratamiento inmediato.</span>
                  <button className="ml-auto text-xs font-medium text-teal-600 hover:underline">Ver Riesgo</button>
                </li>
                <li className="flex items-start text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-3 shrink-0"></span>
                  <span className="text-slate-600">Indicador <strong className="text-slate-800">IND-004</strong> está bajo meta en la última medición.</span>
                  <button className="ml-auto text-xs font-medium text-teal-600 hover:underline">Ver Medición</button>
                </li>
                <li className="flex items-start text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 mr-3 shrink-0"></span>
                  <span className="text-slate-600">Documento <strong className="text-slate-800">DOC-008</strong> requiere revisión anual.</span>
                  <button className="ml-auto text-xs font-medium text-teal-600 hover:underline">Ir a Documentos</button>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {/* CARACTERIZACIÓN (SIPOC) */}
        {activeTab === 'caracterizacion' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Caracterización SIPOC</h3>
              <button className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg">Añadir Componente</button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Entradas */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <h4 className="font-semibold text-slate-800 text-sm">Entradas y Proveedores</h4>
                </div>
                <div className="p-4">
                  {processInputs.length > 0 ? (
                    <ul className="space-y-3">
                      {processInputs.map(input => (
                        <li key={input.id} className="text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                          <span className="font-semibold text-slate-800 block mb-1">{input.description}</span>
                          <span className="text-xs text-slate-500 block">Proveedor: <span className="text-slate-700">{input.supplierName}</span> ({input.supplierType})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No hay entradas definidas para este proceso.</p>
                  )}
                </div>
              </div>
              
              {/* Salidas */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <h4 className="font-semibold text-slate-800 text-sm">Salidas y Clientes</h4>
                </div>
                <div className="p-4">
                  {processOutputs.length > 0 ? (
                    <ul className="space-y-3">
                      {processOutputs.map(output => (
                        <li key={output.id} className="text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                          <span className="font-semibold text-slate-800 block mb-1">{output.description}</span>
                          <span className="text-xs text-slate-500 block">Cliente: <span className="text-slate-700">{output.customerName}</span> ({output.customerType})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No hay salidas definidas para este proceso.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVIDADES */}
        {activeTab === 'actividades' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Flujo de Actividades</h3>
              <button className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg">Añadir Actividad</button>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 w-12 text-center">#</th>
                    <th className="px-4 py-3">Actividad</th>
                    <th className="px-4 py-3">Responsable</th>
                    <th className="px-4 py-3 text-center">IA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {processActivities.length > 0 ? (
                    processActivities.sort((a, b) => a.sequence - b.sequence).map(activity => (
                      <tr key={activity.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-center font-bold text-slate-400">{activity.sequence}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-800">{activity.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {activity.ownerRoleId || activity.ownerUserId || 'Por definir'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {activity.usesAI ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-700" title="Usa Inteligencia Artificial">
                              <Settings className="w-3.5 h-3.5" />
                            </span>
                          ) : '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-500 text-sm italic">
                        Aún no se han definido las actividades paso a paso para este proceso.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RELACIONES */}
        {activeTab === 'relaciones' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Dependencias y Relaciones</h3>
              <button className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg">Vincular Proceso</button>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <p className="text-sm text-slate-600">
                  Mapeo de interacciones con otros procesos del sistema (Upstream y Downstream).
                </p>
              </div>
              <ul className="divide-y divide-slate-100 p-4">
                {processDependencies.length > 0 ? (
                  processDependencies.map(dep => {
                    const isUpstream = dep.targetProcessId === process.id;
                    const relatedProcessId = isUpstream ? dep.sourceProcessId : dep.targetProcessId;
                    const relatedProcess = data.processes?.find(p => p.id === relatedProcessId);
                    
                    return (
                      <li key={dep.id} className="py-3 flex items-start">
                        <div className={`mt-0.5 mr-3 shrink-0 ${isUpstream ? 'text-blue-500' : 'text-purple-500'}`}>
                          <LinkIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center mb-1">
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded mr-2 ${isUpstream ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                              {isUpstream ? 'Entrada (Upstream)' : 'Salida (Downstream)'}
                            </span>
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Tipo: {dep.dependencyType}</span>
                          </div>
                          <p className="text-sm font-medium text-slate-800">{relatedProcess?.name || 'Proceso desconocido'}</p>
                          {dep.description && <p className="text-xs text-slate-600 mt-1">{dep.description}</p>}
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li className="py-8 text-center text-slate-500 text-sm italic">
                    No se han registrado dependencias formales con otros procesos.
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* IA */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Sistemas de IA Relacionados</h3>
              <button className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg">Vincular IA</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {processAiSystems.length > 0 ? (
                processAiSystems.map(ai => (
                  <div key={ai.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:border-teal-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{ai.id}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        ai.lifecycleStage === 'OPERATION' ? 'bg-emerald-100 text-emerald-700' :
                        ai.lifecycleStage === 'DEVELOPMENT' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {ai.lifecycleStage}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800">{ai.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 truncate">{ai.purpose}</p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 flex items-center">
                        <Database className="w-3.5 h-3.5 mr-1" />
                        {ai.modelName || ai.type || "Modelo Desconocido"}
                      </span>
                      <button className="font-medium text-teal-600">Ver Ficha</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-8 text-center">
                  <Settings className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-700 mb-1">Sin Inteligencia Artificial</p>
                  <p className="text-xs text-slate-500">Este proceso no tiene registrados sistemas o modelos de IA activos ni en desarrollo.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ISO */}
        {activeTab === 'iso' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Requisitos ISO Mapeados</h3>
              <button className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg">Asociar Requisito</button>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <ul className="divide-y divide-slate-100">
                {processRequirements.length > 0 ? (
                  processRequirements.map(req => {
                    const catalogInfo = normativeCatalog.find(c => c.standard === req.standard && c.clause === req.clause && c.requirement === req.requirementId);
                    
                    return (
                      <li key={req.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="font-bold text-slate-800 text-sm mr-2">{req.standard} - {req.clause}.{req.requirementId}</span>
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                              req.status === 'implemented' || req.status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                              req.status === 'gap' ? 'bg-rose-100 text-rose-700' :
                              'bg-slate-200 text-slate-700'
                            }`}>
                              {req.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-slate-700">{catalogInfo?.title || 'Requisito normativo'}</p>
                        {catalogInfo?.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{catalogInfo.description}</p>}
                      </li>
                    );
                  })
                ) : (
                  <li className="p-8 text-center">
                    <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-700 mb-1">Sin mapeo ISO</p>
                    <p className="text-xs text-slate-500">No se han asociado requisitos específicos de las normas ISO 27001 o 42001 a este proceso.</p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
