import React, { useState } from 'react';
import { DashboardData, AISystem } from '../../types';
import { ArrowLeft, Edit, ShieldAlert, CheckCircle2, Activity, Database, AlertTriangle } from 'lucide-react';

export function AI360View({ system, data, onClose }: { system: AISystem, data: DashboardData, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'ejecutiva' | 'experta'>('ejecutiva');

  const impacts = (data.aiImpactAssessments || []).filter(i => i.aiSystemId === system.id);
  const hasImpact = impacts.length > 0;
  
  const getApprovalStatus = () => {
    switch (system.approvalStatus) {
      case 'approved': return { label: 'Aprobado', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      case 'conditionally_approved': return { label: 'Aprobado c/ Restricciones', color: 'bg-teal-100 text-teal-700 border-teal-200' };
      case 'pending_review': return { label: 'En Evaluación', color: 'bg-amber-100 text-amber-700 border-amber-200' };
      case 'rejected': return { label: 'Rechazado', color: 'bg-rose-100 text-rose-700 border-rose-200' };
      default: return { label: 'Borrador', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const getRiskColor = (level?: string) => {
    switch (level) {
      case 'critical': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  const approval = getApprovalStatus();

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
                <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">{system.code || 'S/N'}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${approval.color}`}>
                  {approval.label}
                </span>
                <span className="text-xs font-medium text-slate-500">{system.type}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">{system.name}</h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">{system.purpose || 'Sin finalidad definida.'}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className={`px-3 py-1.5 rounded-lg border flex flex-col items-center min-w-[100px] ${getRiskColor(system.riskLevel)}`}>
              <span className="text-[10px] font-bold uppercase">Riesgo IA</span>
              <span className="text-lg font-black uppercase">{system.riskLevel || 'BAJO'}</span>
            </div>
            <button className="mt-2 text-xs font-semibold text-teal-600 flex items-center hover:text-teal-700">
              <Edit className="w-3 h-3 mr-1" /> EDITAR SISTEMA
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-end mt-2">
          <div className="flex space-x-6 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Proceso</span>
              <span className="font-medium text-slate-700">{system.process || 'N/A'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Propietario</span>
              <span className="font-medium text-slate-700">{system.ownerId || 'N/A'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Proveedor</span>
              <span className="font-medium text-slate-700">{system.providerName || 'Interno'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Autonomía</span>
              <span className="font-medium text-slate-700">{system.autonomyLevel || 'ADVISORY'}</span>
            </div>
          </div>

          <div className="flex bg-slate-200/50 p-1 rounded-lg w-max">
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
      </div>

      {/* Internal Tabs */}
      <div className="border-b border-slate-200 px-6">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {[
            { id: 'overview', name: 'OVERVIEW' },
            { id: 'impact', name: 'IMPACTO' },
            { id: 'lifecycle', name: 'CICLO DE VIDA' },
            { id: 'data', name: 'DATOS' },
            { id: 'risks', name: 'RIESGOS Y CONTROLES' },
            { id: 'monitoring', name: 'MONITOREO' }
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center"><ShieldAlert className="w-3.5 h-3.5 mr-1" /> EVAL. DE IMPACTO</p>
                <p className={`text-xl font-bold ${hasImpact ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {hasImpact ? 'Completada' : 'Pendiente'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> CLASIFICACIÓN</p>
                <p className={`text-xl font-bold capitalize ${system.classification === 'prohibited' ? 'text-rose-600' : 'text-slate-800'}`}>
                  {system.classification || 'Pendiente'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center"><Activity className="w-3.5 h-3.5 mr-1" /> ETAPA ACTUAL</p>
                <p className="text-xl font-bold text-slate-800">{system.lifecycleStage || 'EVALUATION'}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center"><AlertTriangle className="w-3.5 h-3.5 mr-1" /> INCIDENTES</p>
                <p className="text-xl font-bold text-emerald-600">0</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Uso Responsable y Restricciones</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-1">Supervisión Humana Requerida</h4>
                  <p className="text-sm text-slate-600">{system.humanOversightLevel || 'No especificada'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-1">Uso de Datos Sensibles / Personales</h4>
                  <div className="flex space-x-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${system.personalData ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                      {system.personalData ? 'Usa Datos Personales' : 'Sin Datos Personales'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${system.sensitiveData ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                      {system.sensitiveData ? 'Usa Datos Sensibles' : 'Sin Datos Sensibles'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'impact' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            {hasImpact ? (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Evaluación de Impacto (AIA)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-100 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Impacto en Privacidad</p>
                    <p className="font-bold text-slate-800">{impacts[0].privacyImpact || 'N/A'}</p>
                  </div>
                  <div className="p-4 border border-slate-100 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Impacto en Equidad</p>
                    <p className="font-bold text-slate-800">{impacts[0].fairnessImpact || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShieldAlert className="w-12 h-12 text-amber-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Este sistema todavía no tiene evaluación de impacto.</h3>
                <button className="px-4 py-2 mt-4 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
                  EVALUAR IMPACTO
                </button>
              </div>
            )}
          </div>
        )}
        
        {activeTab !== 'overview' && activeTab !== 'impact' && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl mb-4">🚧</span>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Sección en Construcción</h3>
            <p className="text-sm text-slate-500 max-w-sm">Los submódulos expertos estarán disponibles al finalizar el roadmap de Gobernanza de IA.</p>
          </div>
        )}
      </div>
    </div>
  );
}
