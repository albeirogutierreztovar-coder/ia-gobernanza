import React from 'react';
import { DashboardData } from '../../types';
import { Shield, FileText, ActivitySquare, BrainCircuit, ExternalLink } from 'lucide-react';

export function HealthWidgets({ data, standard }: { data: DashboardData, standard: string }) {
  const ctrls = standard === 'Integrado' ? data.controlAssessments : data.controlAssessments.filter(c => c.standard === standard);
  
  const controlStats = {
    total: ctrls.length,
    evaluated: ctrls.filter(c => c.status !== 'not_evaluated').length,
    healthy: ctrls.filter(c => c.testResult === 'effective').length,
    attention: ctrls.filter(c => c.testResult === 'partially_effective').length,
    critical: ctrls.filter(c => c.testResult === 'ineffective').length
  };

  const evidenceStats = {
    valid: ctrls.filter(c => c.evidenceStatus === 'valid').length,
    expiring: ctrls.filter(c => c.evidenceStatus === 'expiring').length,
    expired: ctrls.filter(c => c.evidenceStatus === 'expired').length,
    pending: ctrls.filter(c => c.evidenceStatus === 'pending_review').length,
  };

  const riskStats = {
    critical: data.risks.filter(r => r.level === 'Crítico').length,
    high: data.risks.filter(r => r.level === 'Alto').length,
    medium: data.risks.filter(r => r.level === 'Medio').length,
    low: data.risks.filter(r => r.level === 'Bajo').length,
  };

  const impacts = data.aiImpactAssessments || [];
  const aiStats = {
    total: data.aiSystems.length,
    active: data.aiSystems.filter(a => a.lifecycleStage === 'OPERATION' || a.approvalStatus === 'approved').length,
    withoutImpact: data.aiSystems.filter(s => !impacts.some(i => i.aiSystemId === s.id)).length,
    highImpact: data.aiSystems.filter(s => s.impactLevel === 'high' || s.impactLevel === 'critical').length,
    incidents: (data.aiIncidents || []).filter(i => i.status !== 'closed' && i.status !== 'resolved').length,
  };

  const auditStats = {
    findings: data.auditItems.filter(a => a.type === 'finding' && a.status === 'open').length,
    ncs: data.auditItems.filter(a => a.type === 'finding' && a.category === 'no_conformity' && a.status === 'open').length,
    actions: data.auditItems.filter(a => a.type === 'action' && a.status !== 'closed').length,
    expired: data.auditItems.filter(a => a.type === 'action' && new Date(a.dueDate) < new Date()).length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Control Health */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-teal-200 cursor-pointer group">
        <div className="flex items-center mb-3">
          <Shield className="w-4 h-4 text-slate-400 mr-2" />
          <h3 className="text-sm font-semibold text-slate-700">Control Health</h3>
        </div>
        <div className="flex justify-between items-end mb-2">
          <span className="text-2xl font-bold text-slate-800">{controlStats.healthy}<span className="text-sm font-medium text-slate-400">/{controlStats.total}</span></span>
          <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">Saludables</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500"><span>En atención:</span> <span className="text-amber-600">{controlStats.attention}</span></div>
          <div className="flex justify-between text-xs text-slate-500"><span>Críticos:</span> <span className="text-rose-600">{controlStats.critical}</span></div>
        </div>
      </div>

      {/* Evidence Health */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-teal-200 cursor-pointer group">
        <div className="flex items-center mb-3">
          <FileText className="w-4 h-4 text-slate-400 mr-2" />
          <h3 className="text-sm font-semibold text-slate-700">Evidence Health</h3>
        </div>
        <div className="flex justify-between items-end mb-2">
          <span className="text-2xl font-bold text-slate-800">{evidenceStats.valid}<span className="text-sm font-medium text-slate-400">/{controlStats.total}</span></span>
          <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">Vigentes</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500"><span>Por vencer:</span> <span className="text-amber-600">{evidenceStats.expiring}</span></div>
          <div className="flex justify-between text-xs text-slate-500"><span>Vencidas:</span> <span className="text-rose-600">{evidenceStats.expired}</span></div>
        </div>
      </div>

      {/* Risk Exposure */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-teal-200 cursor-pointer group">
        <div className="flex items-center mb-3">
          <ActivitySquare className="w-4 h-4 text-slate-400 mr-2" />
          <h3 className="text-sm font-semibold text-slate-700">Risk Exposure</h3>
        </div>
        <div className="flex justify-between items-end mb-2">
          <span className="text-2xl font-bold text-slate-800">{riskStats.high + riskStats.critical}</span>
          <span className="text-xs text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded">Altos/Críticos</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500"><span>Medios:</span> <span>{riskStats.medium}</span></div>
          <div className="flex justify-between text-xs text-slate-500"><span>Bajos:</span> <span>{riskStats.low}</span></div>
        </div>
      </div>

      {/* AI Governance */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-teal-200 cursor-pointer group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <BrainCircuit className="w-4 h-4 text-slate-400 mr-2" />
            <h3 className="text-sm font-semibold text-slate-700">AI Governance</h3>
          </div>
          <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-teal-500" />
        </div>
        <div className="flex justify-between items-end mb-2">
          <span className="text-2xl font-bold text-slate-800">{aiStats.total}</span>
          <span className="text-xs text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded">Sistemas</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500"><span>Sin Impacto (AIA):</span> <span className={aiStats.withoutImpact > 0 ? "text-amber-600" : "text-emerald-600"}>{aiStats.withoutImpact}</span></div>
          <div className="flex justify-between text-xs text-slate-500"><span>Incidentes IA:</span> <span className={aiStats.incidents > 0 ? "text-rose-600" : "text-slate-500"}>{aiStats.incidents}</span></div>
        </div>
      </div>

      {/* Audit & CAPA */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-teal-200 cursor-pointer group">
        <div className="flex items-center mb-3">
          <Shield className="w-4 h-4 text-slate-400 mr-2" />
          <h3 className="text-sm font-semibold text-slate-700">Audit & CAPA</h3>
        </div>
        <div className="flex justify-between items-end mb-2">
          <span className="text-2xl font-bold text-slate-800">{auditStats.findings}</span>
          <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded">Hallazgos Abiertos</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500"><span>No Conformidades:</span> <span className="text-rose-600">{auditStats.ncs}</span></div>
          <div className="flex justify-between text-xs text-slate-500"><span>Acciones Vencidas:</span> <span className="text-rose-600">{auditStats.expired}</span></div>
        </div>
      </div>
    </div>
  );
}
