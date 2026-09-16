import React from 'react';
import { AlertTriangle, ArrowRight, ShieldAlert, FileWarning, ActivitySquare, AlertOctagon } from 'lucide-react';
import { DashboardData } from '../../types';

export function ActionCenter({ data }: { data: DashboardData }) {
  // Generate priorities based on rules
  const priorities = [];
  
  // Rule 1: Critical risk untreated
  const criticalUntreated = data.risks.filter(r => r.level === 'Alto' && r.status === 'Abierto');
  if (criticalUntreated.length > 0) {
    priorities.push({
      action: 'DECIDIR',
      severity: 'CRÍTICO',
      object: `${criticalUntreated.length} riesgos críticos sin tratamiento`,
      responsible: 'Comité de Riesgos',
      date: 'Inmediato',
      icon: AlertOctagon,
      color: 'text-rose-600',
      bg: 'bg-rose-100'
    });
  }

  // Rule 2: Expired actions
  const expiredActions = data.auditItems.filter(a => a.type === 'action' && new Date(a.dueDate) < new Date());
  if (expiredActions.length > 0) {
    priorities.push({
      action: 'CERRAR',
      severity: 'ALTO',
      object: `${expiredActions.length} acciones correctivas vencidas`,
      responsible: 'Líderes de Proceso',
      date: 'Vencido',
      icon: ActivitySquare,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    });
  }

  // Rule 3: AI System without impact eval
  const aiNoEval = data.aiSystems.filter(ai => ai.riskRating === 'Alto' && ai.approvalStatus === 'pending_review');
  if (aiNoEval.length > 0) {
    priorities.push({
      action: 'EVALUAR',
      severity: 'MEDIO',
      object: `Sistema IA '${aiNoEval[0].name}' requiere evaluación`,
      responsible: 'Oficial de IA',
      date: 'Próxima semana',
      icon: ShieldAlert,
      color: 'text-amber-600',
      bg: 'bg-amber-100'
    });
  }
  
  // Rule 4: Expiring evidence
  const expiringEvidence = data.controlAssessments.filter(c => c.evidenceStatus === 'expiring');
  if (expiringEvidence.length > 0) {
    priorities.push({
      action: 'EVIDENCIAR',
      severity: 'BAJO',
      object: `${expiringEvidence.length} evidencias por vencer`,
      responsible: 'Dueños de Control',
      date: '30 días',
      icon: FileWarning,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    });
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col h-full">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2 text-rose-500" />
        Action Center
      </h2>
      
      {priorities.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
          No hay acciones urgentes pendientes.
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto pr-2 flex-1">
          {priorities.slice(0, 6).map((p, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-100 cursor-pointer transition-colors group">
              <div className="flex items-start">
                <div className={`w-10 h-10 rounded-lg ${p.bg} ${p.color} flex items-center justify-center mr-3 shrink-0`}>
                  <p.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center mb-0.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${p.bg} ${p.color} mr-2`}>
                      {p.action}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{p.date}</span>
                  </div>
                  <p className="text-slate-800 text-sm font-medium leading-tight">{p.object}</p>
                  <p className="text-slate-500 text-xs mt-1">Responsable: {p.responsible}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
