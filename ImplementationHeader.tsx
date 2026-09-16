import React, { useState } from 'react';
import { DashboardData } from '../../types';
import { calculateDashboardKPIs } from '../../utils/calculations';
import { ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { AIAssistantDrawer } from '../ai/AIAssistantDrawer';

export function ImplementationHeader({ data, filters, setFilters }: { data: DashboardData, filters: any, setFilters: any }) {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const kpis = calculateDashboardKPIs(data, filters);
  
  const filteredReqs = data.requirementAssessments.filter(r => 
    filters.standard === 'Integrado' || r.standard === filters.standard
  );

  const verifiedCount = filteredReqs.filter(r => r.status === 'verified').length;
  const gapsCount = filteredReqs.filter(r => r.status === 'gap').length;
  const unassignedCount = filteredReqs.filter(r => r.ownerId === 'Sin asignar' || !r.ownerId).length;

  const filteredActions = (data.implementationActions || []).filter(a => {
    if (filters.standard === 'Integrado') return true;
    // An action might belong to a requirement that belongs to the standard
    const relatedReqs = (a.requirementIds || []).map(rid => 
      data.requirementAssessments.find(req => req.id === rid)
    ).filter(Boolean);
    
    // If it has related reqs, check if any match the standard. If no reqs, just show it.
    if (relatedReqs.length > 0) {
      return relatedReqs.some(r => r?.standard === filters.standard);
    }
    return true; // Keep standalone actions
  });

  const overdueCount = filteredActions.filter(a => a.status === 'VENCIDA' || (a.status !== 'COMPLETADA' && new Date(a.dueDate) < new Date())).length;

  let nextBestAction = { text: "Complete el alcance antes de continuar.", action: "Ir al alcance" };
  if (unassignedCount > 0) {
    nextBestAction = { text: `Existen ${unassignedCount} requisitos sin responsable asignado.`, action: "Asignar responsables" };
  } else if (overdueCount > 0) {
    nextBestAction = { text: `Debe revisar ${overdueCount} acciones vencidas en el plan de trabajo.`, action: "Ver plan" };
  } else if (gapsCount > 0) {
    nextBestAction = { text: `Hay ${gapsCount} brechas identificadas pendientes de acción.`, action: "Crear acciones" };
  } else {
    nextBestAction = { text: "Todo está al día. Continúe con las evaluaciones de desempeño.", action: "Ver evaluación" };
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Implementación y Cumplimiento</h1>
          <p className="text-sm text-slate-500 mt-1">Gestión integral de requisitos normativos y brechas operativas.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
            value={filters.standard}
            onChange={(e) => setFilters({...filters, standard: e.target.value})}
          >
            <option value="Integrado">Integrado (27001 + 42001)</option>
            <option value="ISO/IEC 27001">ISO/IEC 27001:2022</option>
            <option value="ISO/IEC 42001">ISO/IEC 42001:2023</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-4 border-y border-slate-100 mb-4">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase">Avance Implementación</p>
          <p className="text-xl font-bold text-slate-800">{kpis.implementation}%</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase">Evidencia</p>
          <p className="text-xl font-bold text-slate-800">{kpis.evidence}%</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase">Requisitos Verificados</p>
          <p className="text-xl font-bold text-emerald-600">{verifiedCount}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase">Brechas Abiertas</p>
          <p className="text-xl font-bold text-rose-600">{gapsCount}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase">Acciones Vencidas</p>
          <p className="text-xl font-bold text-orange-600">{overdueCount}</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-50 to-teal-50/30 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between border border-slate-100 gap-3">
        <div className="flex items-center text-sm flex-1">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-600 mr-3 shrink-0">
            <AlertCircle className="w-3.5 h-3.5" />
          </span>
          <span className="font-semibold text-slate-700 mr-2">Siguiente mejor acción:</span>
          <span className="text-slate-600">{nextBestAction.text}</span>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button onClick={() => setIsAssistantOpen(true)} className="flex items-center text-xs font-semibold text-white bg-teal-600 px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Guía Paso a Paso
          </button>
        </div>
      </div>
      
      <AIAssistantDrawer 
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        context="implementation"
      />
    </div>
  );
}
