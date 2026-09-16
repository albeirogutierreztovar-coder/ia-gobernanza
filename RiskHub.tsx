import React, { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert, Plus, Filter, Target } from "lucide-react";
import { SlideOver } from "../components/ui/SlideOver";
import { RiskForm } from "../components/forms/RiskForm";
import { RiskDetailsSlideOver } from "../components/ui/RiskDetailsSlideOver";

export function RiskHub() {
  const { data, fetchData, loading } = useStore();
  const { currentOrgId } = useAuth();
  
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<any>(null);

  useEffect(() => {
    if (currentOrgId) fetchData(currentOrgId);
  }, [fetchData, currentOrgId]);

  if (loading || !data)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium">
            Cargando Risk Hub...
          </p>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Risk & Impact Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Registro centralizado de riesgos de seguridad de la información e
            Inteligencia Artificial.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Target className="w-4 h-4 mr-2" />
            Risk Radar
          </button>
          <button 
            onClick={() => setIsSlideOverOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Identificar Riesgo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-slate-500 mb-1">
            Total Riesgos Activos
          </span>
          <span className="text-2xl font-bold text-slate-800">
            {data.risks.length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-rose-600 mb-1">
            Riesgos Críticos
          </span>
          <span className="text-2xl font-bold text-rose-700">
            {data.risks.filter((r) => r.level === "Crítico").length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-orange-600 mb-1">
            Riesgos Altos
          </span>
          <span className="text-2xl font-bold text-orange-700">
            {data.risks.filter((r) => r.level === "Alto").length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-slate-500 mb-1">
            Con Tratamiento
          </span>
          <span className="text-2xl font-bold text-slate-800">
            {data.risks.filter((r) => r.status === "Tratado").length}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 flex items-center">
            <ShieldAlert className="w-5 h-5 mr-2 text-slate-500" />
            Inventario de Riesgos
          </h2>
          <button className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-800">
                  Descripción del Riesgo
                </th>
                <th className="px-6 py-4 font-semibold text-slate-800">
                  Categoría
                </th>
                <th className="px-6 py-4 font-semibold text-slate-800">
                  Nivel (Inherente)
                </th>
                <th className="px-6 py-4 font-semibold text-slate-800">
                  Estado de Tratamiento
                </th>
                <th className="px-6 py-4 text-right font-semibold text-slate-800">
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.risks.map((risk) => (
                <tr
                  key={risk.id}
                  className="hover:bg-slate-50 group transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{risk.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ID: {risk.id.toUpperCase()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {risk.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                        risk.level === "Crítico"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : risk.level === "Alto"
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : risk.level === "Medio"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {risk.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          risk.status === "Tratado"
                            ? "bg-emerald-500"
                            : risk.status === "Aceptado"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                        }`}
                      />
                      <span className="text-slate-700">{risk.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      className="text-teal-600 hover:text-teal-900 font-medium text-sm transition-colors"
                      onClick={() => setSelectedRisk(risk)}
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <SlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        title="Registrar Nuevo Riesgo"
        description="Añade un nuevo riesgo a la matriz. Se evaluará automáticamente contra los controles."
      >
        <RiskForm 
          onSuccess={() => setIsSlideOverOpen(false)}
          onCancel={() => setIsSlideOverOpen(false)}
        />
      </SlideOver>

      <RiskDetailsSlideOver
        isOpen={!!selectedRisk}
        onClose={() => setSelectedRisk(null)}
        risk={selectedRisk}
      />
    </div>
  );
}
