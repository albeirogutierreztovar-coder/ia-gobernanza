import React from 'react';
import { DashboardData } from '../../types';
import { Trophy, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export function TeamPerformanceTab({ data, standard }: { data: DashboardData, standard?: string }) {
  // Aggregate tasks: Implementation Actions + CAPAs
  const implementationActions = data.implementationActions || [];
  const capas = data.capas || [];
  const ncs = data.nonConformities || [];
  
  // Filter by standard
  const filteredActions = implementationActions.filter(a => {
    if (standard === 'Integrado') return true;
    const reqs = (a.requirementIds || []).map(rid => data.requirementAssessments.find(r => r.id === rid)).filter(Boolean);
    if (reqs.length > 0) return reqs.some(r => r?.standard === standard);
    return true;
  });

  const filteredCAPAs = capas.filter(capa => {
    if (standard === 'Integrado') return true;
    if (capa.nonConformityId) {
       const parentNC = ncs.find(n => n.id === capa.nonConformityId);
       return parentNC?.standardIds?.includes(standard!);
    }
    return true; 
  });

  // Calculate metrics per user
  const userMetrics: Record<string, { total: number, completed: number, overdue: number, score: number }> = {};
  
  const processTask = (ownerId: string, isCompleted: boolean, isOverdue: boolean) => {
    if (!ownerId || ownerId === 'Sin asignar') ownerId = 'Sin asignar';
    if (!userMetrics[ownerId]) {
      userMetrics[ownerId] = { total: 0, completed: 0, overdue: 0, score: 0 };
    }
    userMetrics[ownerId].total++;
    if (isCompleted) userMetrics[ownerId].completed++;
    if (isOverdue && !isCompleted) userMetrics[ownerId].overdue++;
  };

  filteredActions.forEach(a => {
    const isCompleted = a.status === 'COMPLETADA';
    const isOverdue = a.status === 'VENCIDA' || (!isCompleted && new Date(a.dueDate) < new Date());
    processTask(a.ownerId || 'Sin asignar', isCompleted, isOverdue);
  });

  filteredCAPAs.forEach(c => {
    const isCompleted = c.status === 'Cerrada' || c.status === 'Verificada';
    const isOverdue = !isCompleted && new Date(c.dueDate) < new Date();
    processTask(c.ownerId, isCompleted, isOverdue);
  });

  // Calculate scores
  Object.values(userMetrics).forEach(m => {
    if (m.total > 0) {
      // 100 base score, minus 20 for each overdue, plus completion ratio
      m.score = Math.max(0, Math.min(100, Math.round((m.completed / m.total) * 100) - (m.overdue > 0 ? m.overdue * 10 : 0)));
    }
  });

  const topPerformers = Object.entries(userMetrics)
    .filter(([name]) => name !== 'Sin asignar')
    .sort((a, b) => b[1].score - a[1].score);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <Trophy className="w-5 h-5 text-amber-500 mr-2" />
            Rendimiento por Responsable
          </h2>
          
          <div className="space-y-4">
            {topPerformers.length > 0 ? topPerformers.map(([name, metrics]) => (
              <div key={name} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{name}</p>
                    <p className="text-xs text-slate-500">{metrics.total} tareas asignadas</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Completadas</p>
                    <p className="font-medium text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> {metrics.completed}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Vencidas</p>
                    <p className={`font-medium flex items-center justify-center ${metrics.overdue > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                      <AlertCircle className="w-3 h-3 mr-1" /> {metrics.overdue}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 mb-1">Score</p>
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-slate-200 rounded-full mr-2 overflow-hidden">
                        <div 
                          className={`h-full ${metrics.score >= 80 ? 'bg-emerald-500' : metrics.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${metrics.score}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-700 w-8">{metrics.score}</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-slate-500 text-sm text-center py-4">No hay tareas asignadas actualmente.</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Métricas Globales</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-red-800">Tareas Vencidas</p>
                <Clock className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">
                {Object.values(userMetrics).reduce((acc, curr) => acc + curr.overdue, 0)}
              </p>
              <p className="text-xs text-red-600/70 mt-1">Requieren atención inmediata</p>
            </div>
            
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-slate-700">Sin Asignar</p>
                <AlertCircle className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-2xl font-bold text-slate-700">
                {userMetrics['Sin asignar']?.total || 0}
              </p>
              <p className="text-xs text-slate-500 mt-1">Tareas huérfanas</p>
            </div>
            
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-emerald-800">Tasa de Cierre</p>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-600">
                {Object.values(userMetrics).reduce((acc, curr) => acc + curr.total, 0) > 0 
                  ? Math.round((Object.values(userMetrics).reduce((acc, curr) => acc + curr.completed, 0) / Object.values(userMetrics).reduce((acc, curr) => acc + curr.total, 0)) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
