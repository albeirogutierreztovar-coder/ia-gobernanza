import React, { useState } from 'react';
import { DashboardData, Process } from '../../types';
import { ShieldAlert, Bot, CheckCircle2 } from 'lucide-react';
import { Process360View } from './Process360View';

export function ProcessMapTab({ data }: { data: DashboardData }) {
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  
  const processes = data.processes || [];
  const categorize = (cat: string) => processes.filter(p => p.category === cat);
  
  const strategic = categorize('strategic');
  const mission = categorize('mission');
  const support = categorize('support');
  const control = categorize('control');

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (health >= 60) return 'text-teal-600 bg-teal-50 border-teal-200';
    if (health >= 40) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const calculateHealth = (process: Process) => {
    // Mock health calculation based on criticality to show variability
    if (process.criticality === 'critical') return 82;
    if (process.criticality === 'high') return 75;
    if (process.criticality === 'medium') return 60;
    return 95;
  };

  if (selectedProcess) {
    return <Process360View process={selectedProcess} data={data} onClose={() => setSelectedProcess(null)} />;
  }

  const ProcessCard = ({ p }: { key?: string, p: Process }) => {
    const health = calculateHealth(p);
    const usesAi = (data.aiSystems || []).some(ai => ai.process === p.name);
    
    return (
      <div 
        className="bg-white border border-slate-200 rounded-xl p-4 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer"
        onClick={() => setSelectedProcess(p)}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{p.code || 'N/A'}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getHealthColor(health)}`}>
            {health}% Salud
          </span>
        </div>
        <h4 className="text-sm font-bold text-slate-800 mb-1">{p.name}</h4>
        <p className="text-xs text-slate-500 mb-3 truncate flex items-center">
          <span className="w-4 h-4 bg-slate-100 rounded-full inline-flex items-center justify-center text-[10px] mr-1">R</span>
          {p.ownerId || 'Sin responsable'}
        </p>
        
        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
          <div className="flex space-x-2">
            {p.criticality === 'critical' && <ShieldAlert className="w-3.5 h-3.5 text-rose-500" title="Proceso Crítico" />}
            {usesAi && <Bot className="w-3.5 h-3.5 text-teal-500" title="Usa IA" />}
          </div>
          <div className="text-[10px] uppercase font-semibold text-teal-600 flex items-center">
            Explorar
          </div>
        </div>
      </div>
    );
  };

  const CategorySection = ({ title, processes, colorClass }: { title: string, processes: Process[], colorClass: string }) => (
    <div className={`rounded-xl p-5 border ${colorClass}`}>
      <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center">
        {title}
        <span className="ml-2 bg-white px-2 py-0.5 rounded-full text-xs font-bold">{processes.length}</span>
      </h3>
      {processes.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No hay procesos registrados en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {processes.map(p => <ProcessCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <CategorySection title="Procesos Estratégicos" processes={strategic} colorClass="bg-slate-50 border-slate-200 text-slate-700" />
      <CategorySection title="Procesos Misionales / Operativos" processes={mission} colorClass="bg-teal-50/30 border-teal-100 text-teal-800" />
      <CategorySection title="Procesos de Apoyo" processes={support} colorClass="bg-blue-50/30 border-blue-100 text-blue-800" />
      <CategorySection title="Procesos de Control / Evaluación" processes={control} colorClass="bg-purple-50/30 border-purple-100 text-purple-800" />
    </div>
  );
}
