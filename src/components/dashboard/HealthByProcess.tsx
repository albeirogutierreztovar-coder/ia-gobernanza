import React from 'react';
import { DashboardData } from '../../types';

export function HealthByProcess({ data }: { data: DashboardData }) {
  // Mock logic to calculate health per process based on controls assigned to it
  const processHealth = data.processes.map(p => {
    const pCtrls = data.controlAssessments.filter(c => c.process === p.name || c.process === p.code);
    if (pCtrls.length === 0) return { name: p.name, health: 0, hasData: false };
    
    // Simple average of implementation status
    const weights: any = { implemented: 70, evidenced: 90, verified: 100, documented: 40, planned: 20, gap: 0, not_evaluated: 0 };
    let score = 0;
    pCtrls.forEach(c => score += (weights[c.status] || 0));
    return { name: p.name, health: Math.round(score / pCtrls.length), hasData: true };
  }).filter(p => p.hasData).sort((a, b) => b.health - a.health);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Salud por Proceso</h2>
      
      {processHealth.length === 0 ? (
        <div className="text-sm text-slate-400 text-center py-4">Sin datos de procesos</div>
      ) : (
        <div className="space-y-4">
          {processHealth.map((p, i) => (
            <div key={i} className="cursor-pointer group">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 group-hover:text-teal-600 transition-colors">{p.name}</span>
                <span className="font-medium text-slate-800">{p.health}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${p.health >= 80 ? 'bg-emerald-500' : p.health >= 60 ? 'bg-amber-400' : 'bg-rose-500'}`} 
                  style={{ width: `${p.health}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
