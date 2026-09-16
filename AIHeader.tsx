import React from 'react';
import { DashboardData } from '../../types';
import { calculateAIHealth } from '../../utils/calculations';

export function AIHeader({ data }: { data: DashboardData }) {
  const aiSystems = data.aiSystems || [];
  const providers = data.aiProviders || [];
  const incidents = data.aiIncidents || [];
  const impacts = data.aiImpactAssessments || [];

  const approved = aiSystems.filter(s => s.approvalStatus === 'approved').length;
  const restricted = aiSystems.filter(s => s.classification === 'restricted').length;
  const prohibited = aiSystems.filter(s => s.classification === 'prohibited').length;
  const pending = aiSystems.filter(s => s.approvalStatus === 'pending_review' || s.approvalStatus === 'draft').length;
  
  const withoutOwner = aiSystems.filter(s => !s.ownerId).length;
  const withoutImpact = aiSystems.filter(s => !impacts.some(i => i.aiSystemId === s.id)).length;
  
  const highImpact = aiSystems.filter(s => s.impactLevel === 'high' || s.impactLevel === 'critical').length;
  const highRisk = aiSystems.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical').length;
  
  const overdueReview = aiSystems.filter(s => s.nextReviewDate && new Date(s.nextReviewDate) < new Date()).length;
  
  const openIncidents = incidents.filter(i => i.status !== 'closed' && i.status !== 'resolved').length;
  
  const inProduction = aiSystems.filter(s => s.lifecycleStage === 'OPERATION').length;
  const inDevelopment = aiSystems.filter(s => s.lifecycleStage === 'DEVELOPMENT' || s.lifecycleStage === 'DESIGN' || s.lifecycleStage === 'EVALUATION').length;
  
  const healthScore = calculateAIHealth(data);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Centro de Inteligencia Artificial</h1>
          <p className="text-sm text-slate-500 mt-1">Gobernanza completa del ciclo de vida, datos, modelos y proveedores de IA.</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>AI GOVERNANCE HEALTH</span>
            <div className="relative group cursor-help">
              <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">?</span>
              <div className="absolute right-0 top-6 w-64 bg-slate-800 text-white p-3 rounded-lg text-xs hidden group-hover:block z-10 font-normal normal-case">
                Indicador interno de gobierno del sistema IA. No representa certificación ISO.
              </div>
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-lg border font-bold text-lg ${
            healthScore >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            healthScore >= 60 ? 'bg-teal-50 text-teal-700 border-teal-200' :
            healthScore >= 40 ? 'bg-amber-50 text-amber-700 border-amber-200' :
            'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {healthScore}%
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 pt-4 border-t border-slate-100">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase">Total Sistemas</p>
          <p className="text-xl font-black text-slate-800">{aiSystems.length}</p>
          <p className="text-[10px] text-slate-500 mt-1">{inProduction} en prod. / {inDevelopment} en dev.</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase">Estado Aprobación</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm font-bold text-emerald-600" title="Aprobados">{approved}</span>
            <span className="text-slate-300">|</span>
            <span className="text-sm font-bold text-amber-500" title="Pendientes">{pending}</span>
            <span className="text-slate-300">|</span>
            <span className="text-sm font-bold text-rose-600" title="Prohibidos">{prohibited}</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase">Impacto / Riesgo Alto</p>
          <p className="text-xl font-bold text-rose-600">{highImpact} / {highRisk}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase">Sin Propietario</p>
          <p className={`text-xl font-bold ${withoutOwner > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{withoutOwner}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase">Sin Evaluación</p>
          <p className={`text-xl font-bold ${withoutImpact > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{withoutImpact}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase">Proveedores / Incidentes</p>
          <p className={`text-xl font-bold ${openIncidents > 0 ? 'text-rose-600' : 'text-slate-700'}`}>{providers.length} / {openIncidents}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase">Revisión Vencida</p>
          <p className={`text-xl font-bold ${overdueReview > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{overdueReview}</p>
        </div>
      </div>
    </div>
  );
}
