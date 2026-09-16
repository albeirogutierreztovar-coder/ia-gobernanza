import React, { useState } from 'react';
import { DashboardData } from '../../types';
import { CalendarDays, AlertTriangle, CheckCircle2, ClipboardCheck, Sparkles } from 'lucide-react';
import { AIAssistantDrawer } from '../ai/AIAssistantDrawer';

export function AuditHeader({ data, filters, setFilters }: { data: DashboardData, filters: any, setFilters: any }) {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const sessions = data.auditSessions || [];
  const nonConformities = data.nonConformities || [];
  
  const filteredSessions = sessions.filter(s => filters.standard === 'Integrado' || s.standard === filters.standard);
  const planned = filteredSessions.filter(s => s.status === 'Programada').length;
  const inProgress = filteredSessions.filter(s => s.status === 'En Progreso').length;
  const completed = filteredSessions.filter(s => s.status === 'Completada').length;

  const auditFindings = nonConformities.filter(nc => 
    nc.source === 'Auditoría' && 
    (filters.standard === 'Integrado' || nc.standardIds?.includes(filters.standard))
  );
  
  const openFindings = auditFindings.filter(nc => nc.status !== 'Cerrada').length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Workspace</h1>
          <p className="text-sm text-slate-500 mt-1">Planificación de auditorías, checklists de evaluación y gestión de hallazgos.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsAssistantOpen(true)}
            className="flex items-center text-xs font-semibold text-white bg-teal-600 px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Guía Paso a Paso
          </button>
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
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Programadas</p>
            <p className="text-lg font-bold text-slate-900">{planned}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">En Ejecución</p>
            <p className="text-lg font-bold text-amber-700">{inProgress}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Completadas</p>
            <p className="text-lg font-bold text-emerald-700">{completed}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Hallazgos Abiertos</p>
            <p className="text-lg font-bold text-red-600">{openFindings}</p>
          </div>
        </div>
      </div>

      <AIAssistantDrawer 
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        context="audit"
      />
    </div>
  );
}
