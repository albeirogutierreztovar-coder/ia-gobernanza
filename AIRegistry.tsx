import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { Cpu, Plus, Filter, Box } from 'lucide-react';
import { SlideOver } from '../components/ui/SlideOver';
import { AISystemWizard } from '../components/ai/AISystemWizard';

export function AIRegistry() {
  const { data, fetchData, loading } = useStore();
  const { currentOrgId } = useAuth();
  
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  useEffect(() => {
    if (currentOrgId && !data) fetchData(currentOrgId);
  }, [fetchData, currentOrgId, data]);

  if (loading || !data) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Cargando AI Registry...</p>
      </div>
    </div>
  );

  const aiSystems = data.aiSystems || [];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Registry (Inventario de IA)</h1>
          <p className="text-sm text-slate-500 mt-1">Inventario centralizado de modelos, asistentes y sistemas de Inteligencia Artificial (ISO 42001).</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsWizardOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Registrar Sistema IA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-slate-500 mb-1">Total Sistemas IA</span>
          <span className="text-2xl font-bold text-slate-800">{aiSystems.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-teal-200 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-teal-600 mb-1">Aprobados / Producción</span>
          <span className="text-2xl font-bold text-teal-700">{aiSystems.filter(ai => ai.approvalStatus === 'approved').length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-amber-600 mb-1">En Evaluación</span>
          <span className="text-2xl font-bold text-amber-700">{aiSystems.filter(ai => ai.approvalStatus === 'draft' || ai.approvalStatus === 'pending_review' || !ai.approvalStatus).length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-rose-600 mb-1">Riesgo Alto/Crítico</span>
          <span className="text-2xl font-bold text-rose-700">{aiSystems.filter(ai => ai.riskLevel === 'high' || ai.riskLevel === 'critical').length}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 flex items-center">
            <Cpu className="w-5 h-5 mr-2 text-slate-500" />
            Inventario de Activos
          </h2>
          <button className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </button>
        </div>
        
        {aiSystems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-white border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-800">Sistema / Código</th>
                  <th className="px-6 py-4 font-semibold text-slate-800">Tipo</th>
                  <th className="px-6 py-4 font-semibold text-slate-800">Propietario</th>
                  <th className="px-6 py-4 font-semibold text-slate-800">Estado</th>
                  <th className="px-6 py-4 font-semibold text-slate-800">Nivel de Riesgo</th>
                  <th className="px-6 py-4 text-right font-semibold text-slate-800">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {aiSystems.map((ai) => (
                  <tr key={ai.id} className="hover:bg-slate-50 group transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{ai.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{ai.code || ai.id.substring(0,8).toUpperCase()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {ai.type?.replace(/_/g, ' ') || 'SISTEMA IA'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700">{ai.ownerId || 'Sin asignar'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        ai.approvalStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        ai.approvalStatus === 'rejected' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {ai.approvalStatus?.replace(/_/g, ' ') || 'EN EVALUACIÓN'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                        ai.riskLevel === 'critical' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        ai.riskLevel === 'high' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        ai.riskLevel === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {(ai.riskLevel || 'medium').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-teal-600 hover:text-teal-900 font-medium text-sm transition-colors">
                        Evaluar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Box className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium text-lg">El inventario de IA está vacío</p>
            <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
              Comienza a registrar los sistemas, aplicaciones, agentes o modelos de Inteligencia Artificial que utiliza tu organización para evaluarlos según la norma ISO 42001.
            </p>
            <button 
              onClick={() => setIsWizardOpen(true)}
              className="mt-6 inline-flex items-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Registrar Primer Sistema IA
            </button>
          </div>
        )}
      </div>

      <SlideOver
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        title="Evaluación Inicial de IA (Screening)"
        description="Completa el cuestionario para registrar y pre-clasificar un nuevo sistema de IA."
      >
        <div className="h-full">
          <AISystemWizard onClose={() => setIsWizardOpen(false)} />
        </div>
      </SlideOver>
    </div>
  );
}
