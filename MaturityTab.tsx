import React from 'react';
import { DashboardData } from '../../types';
import { BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

export function MaturityTab({ data, standard }: { data: DashboardData, standard?: string }) {
  const controls = data.normativeControls || [];
  const filteredControls = controls.filter(c => (standard === 'Integrado' || c.standard === standard) && c.applicable);
  
  // Calculate average maturity per domain
  const domainMaturity: Record<string, { total: number, sum: number, avg: number, count0: number, count1_2: number, count3_5: number }> = {};
  
  filteredControls.forEach(c => {
    if (!domainMaturity[c.domain]) {
      domainMaturity[c.domain] = { total: 0, sum: 0, avg: 0, count0: 0, count1_2: 0, count3_5: 0 };
    }
    const level = c.maturityLevel;
    domainMaturity[c.domain].total++;
    domainMaturity[c.domain].sum += level;
    if (level === 0) domainMaturity[c.domain].count0++;
    else if (level <= 2) domainMaturity[c.domain].count1_2++;
    else domainMaturity[c.domain].count3_5++;
  });

  Object.values(domainMaturity).forEach(d => {
    d.avg = d.total > 0 ? Number((d.sum / d.total).toFixed(1)) : 0;
  });

  const overallAvg = filteredControls.length > 0 
    ? Number((filteredControls.reduce((acc, c) => acc + c.maturityLevel, 0) / filteredControls.length).toFixed(1))
    : 0;

  const domains = Object.entries(domainMaturity).sort((a, b) => b[1].avg - a[1].avg);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 text-teal-600 mr-2" />
            Madurez por Dominio (CMMI 0-5)
          </h2>
          
          <div className="space-y-6">
            {domains.map(([domain, metrics]) => (
              <div key={domain}>
                <div className="flex justify-between items-end mb-2">
                  <div className="max-w-[70%]">
                    <p className="font-medium text-slate-800 truncate" title={domain}>{domain}</p>
                    <p className="text-xs text-slate-500">{metrics.total} controles</p>
                  </div>
                  <span className="font-bold text-slate-700 text-lg">{metrics.avg}</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-red-400"
                    style={{ width: `${(metrics.count0 / metrics.total) * 100}%` }}
                    title={`Nivel 0: ${metrics.count0}`}
                  />
                  <div 
                    className="h-full bg-amber-400"
                    style={{ width: `${(metrics.count1_2 / metrics.total) * 100}%` }}
                    title={`Nivel 1-2: ${metrics.count1_2}`}
                  />
                  <div 
                    className="h-full bg-emerald-500"
                    style={{ width: `${(metrics.count3_5 / metrics.total) * 100}%` }}
                    title={`Nivel 3-5: ${metrics.count3_5}`}
                  />
                </div>
              </div>
            ))}
            
            {domains.length === 0 && (
              <p className="text-center text-slate-500 py-8">No hay datos de madurez disponibles.</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Madurez Promedio</h3>
          <div className="flex items-center justify-center space-x-2">
            <span className={`text-5xl font-extrabold ${overallAvg >= 3 ? 'text-emerald-600' : overallAvg >= 1.5 ? 'text-amber-500' : 'text-red-500'}`}>
              {overallAvg}
            </span>
            <span className="text-2xl text-slate-400">/ 5</span>
          </div>
          <p className="text-sm text-slate-600 mt-4">
            {overallAvg >= 3 ? 'La organización tiene procesos definidos y medibles.' : 
             overallAvg >= 1.5 ? 'Procesos informales o en fase de estandarización.' :
             'Procesos impredecibles, no controlados o inexistentes.'}
          </p>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-teal-600" />
            Niveles CMMI
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between items-center">
              <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-emerald-600 mr-2" />5 - Optimizado</span>
              <span className="text-slate-500 font-medium">Mejora continua</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-emerald-400 mr-2" />4 - Gestionado</span>
              <span className="text-slate-500 font-medium">Medible</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-teal-400 mr-2" />3 - Definido</span>
              <span className="text-slate-500 font-medium">Estandarizado</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-amber-400 mr-2" />2 - Repetible</span>
              <span className="text-slate-500 font-medium">Informal</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-orange-400 mr-2" />1 - Inicial</span>
              <span className="text-slate-500 font-medium">Impredecible</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2" />0 - Inexistente</span>
              <span className="text-slate-500 font-medium">Sin práctica</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-800">Objetivo de Certificación</h4>
            <p className="text-xs text-amber-700 mt-1">Para lograr la certificación ISO, se recomienda un nivel de madurez mínimo de 3 (Definido) en todos los controles aplicables.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
