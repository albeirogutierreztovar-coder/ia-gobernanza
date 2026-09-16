import React, { useState } from "react";
import {
  ShieldCheck,
  Target,
  FileCheck,
  CheckCircle2,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { SlideOver } from "../ui/SlideOver";

function KpiCard({
  title,
  value,
  previousValue,
  color,
  icon: Icon,
  tooltip,
  compare,
  inverseBad = false,
  onExplore,
}: any) {
  const variation = (value || 0) - (previousValue || 0);
  const isPositive = inverseBad ? variation < 0 : variation > 0;
  const isNeutral = variation === 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col h-full">
      <div className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 cursor-help">
        <Info className="w-4 h-4" />
        <div className="absolute hidden group-hover:block w-48 bg-slate-800 text-white text-xs p-2 rounded right-0 top-6 z-10 shadow-lg">
          {tooltip}
        </div>
      </div>
      <div className="flex items-center mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 shrink-0"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            {title}
          </h3>
          <div className="flex items-baseline mt-1">
            <span className="text-3xl font-bold text-slate-800">
              {value || 0}%
            </span>
            {compare && !isNeutral && (
              <span
                className={`ml-2 flex items-center text-xs font-medium ${isPositive ? "text-emerald-600" : "text-rose-600"}`}
              >
                {isPositive ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                )}
                {Math.abs(variation)}%
              </span>
            )}
            {compare && isNeutral && (
              <span className="ml-2 text-xs font-medium text-slate-400">
                Sin cambios
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {(value || 0) >= 80
            ? "Óptimo"
            : (value || 0) >= 60
              ? "Aceptable"
              : "En Atención"}
        </span>
        <button 
          onClick={() => alert("Los detalles completos de métricas avanzadas estarán disponibles en el Dashboard V2.")}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 uppercase focus:outline-none focus:underline"
        >
          Ver Detalle
        </button>
      </div>
    </div>
  );
}

export function KPIWidgets({ kpis, compare }: { kpis: any; compare: boolean }) {
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);

  const variation = kpis?.variation || {
    implementation: 0,
    evidence: 0,
    efficacy: 0,
    auditReadiness: 0,
  };

  const getKpiDetails = () => {
    switch (selectedKpi) {
      case 'Implementación':
        return (
          <div className="space-y-4">
             <p className="text-sm text-slate-600">Este indicador mide el porcentaje de requisitos y controles normativos que han sido formalmente implementados y documentados en la organización.</p>
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
               <h4 className="font-semibold text-slate-800 mb-2">Desglose de Puntuación</h4>
               <ul className="space-y-2 text-sm text-slate-600">
                 <li className="flex justify-between"><span>Controles Implementados (100%):</span> <span className="font-medium text-slate-900">{kpis?.maturityCounts?.L4 + kpis?.maturityCounts?.L5 || 0}</span></li>
                 <li className="flex justify-between"><span>Controles en Proceso (50%):</span> <span className="font-medium text-slate-900">{kpis?.maturityCounts?.L2 + kpis?.maturityCounts?.L3 || 0}</span></li>
                 <li className="flex justify-between"><span>Controles No Implementados (0%):</span> <span className="font-medium text-slate-900">{kpis?.maturityCounts?.L0 + kpis?.maturityCounts?.L1 || 0}</span></li>
               </ul>
             </div>
             <p className="text-xs text-slate-500 mt-4">Para mejorar este indicador, dirígete a la pestaña de Controles y actualiza el estado de implementación de las brechas identificadas.</p>
          </div>
        );
      case 'Evidencia':
        return (
          <div className="space-y-4">
             <p className="text-sm text-slate-600">Representa la cobertura de controles con evidencia válida adjunta, penalizando aquellas evidencias que se encuentran vencidas o han sido rechazadas en revisiones.</p>
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
               <h4 className="font-semibold text-slate-800 mb-2">Estado de Evidencias</h4>
               <ul className="space-y-2 text-sm text-slate-600">
                 <li className="flex justify-between"><span>Evidencias Vigentes:</span> <span className="font-medium text-emerald-600">45%</span></li>
                 <li className="flex justify-between"><span>Evidencias Vencidas:</span> <span className="font-medium text-rose-600">12%</span></li>
                 <li className="flex justify-between"><span>Sin Evidencia:</span> <span className="font-medium text-slate-900">43%</span></li>
               </ul>
             </div>
          </div>
        );
      case 'Eficacia':
        return (
          <div className="space-y-4">
             <p className="text-sm text-slate-600">Mide qué tan efectivos están siendo los controles implementados en la práctica, basado en los resultados de las últimas pruebas y auditorías.</p>
             <div className="bg-amber-50 text-amber-800 p-4 rounded-lg border border-amber-200 text-sm">
               Existen {kpis?.notTestedCount || 12} controles implementados que aún no han sido probados formalmente. Realizar pruebas de diseño y operación aumentará este indicador.
             </div>
          </div>
        );
      case 'Audit Readiness':
        return (
          <div className="space-y-4">
             <p className="text-sm text-slate-600">Un cálculo integral que determina qué tan preparada está la organización para afrontar una auditoría de certificación formal de manera exitosa.</p>
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
               <h4 className="font-semibold text-slate-800 mb-2">Fórmula de Preparación</h4>
               <ul className="space-y-2 text-sm text-slate-600">
                 <li className="flex justify-between"><span>Implementación (30% peso):</span> <span className="font-medium text-slate-900">{kpis?.implementation || 0}%</span></li>
                 <li className="flex justify-between"><span>Evidencia (30% peso):</span> <span className="font-medium text-slate-900">{kpis?.evidence || 0}%</span></li>
                 <li className="flex justify-between"><span>Eficacia (25% peso):</span> <span className="font-medium text-slate-900">{kpis?.efficacy || 0}%</span></li>
                 <li className="flex justify-between"><span>Acciones y Riesgos (15% peso):</span> <span className="font-medium text-slate-900">Deducción de -5%</span></li>
               </ul>
             </div>
          </div>
        );
      case 'Risk Exposure':
        return (
          <div className="space-y-4">
             <p className="text-sm text-slate-600">El nivel de exposición global de la organización basado en los riesgos residuales que se encuentran actualmente fuera del apetito o tolerancia definidos.</p>
             <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
               <h4 className="font-semibold text-rose-800 mb-2">Factores Críticos a Mitigar</h4>
               <ul className="space-y-2 text-sm text-rose-700">
                 <li className="flex items-center"><ShieldAlert className="w-4 h-4 mr-2" /> Riesgos Críticos sin plan de tratamiento</li>
                 <li className="flex items-center"><ShieldAlert className="w-4 h-4 mr-2" /> Planes de acción de riesgos vencidos</li>
               </ul>
             </div>
          </div>
        );
      default:
        return <p className="text-sm text-slate-600">No hay detalles adicionales disponibles.</p>;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Implementación"
          value={kpis?.implementation}
          previousValue={
            (kpis?.implementation || 0) - (variation.implementation || 0)
          }
          color="#0ea5e9"
          icon={Target}
          compare={compare}
          tooltip="Promedio de estado de requisitos y controles (Documentado = 40%, Implementado = 70%, etc.)"
          onExplore={() => setSelectedKpi('Implementación')}
        />
        <KpiCard
          title="Evidencia"
          value={kpis?.evidence}
          previousValue={(kpis?.evidence || 0) - (variation.evidence || 0)}
          color="#8b5cf6"
          icon={FileCheck}
          compare={compare}
          tooltip="Cobertura de controles con evidencia válida. Penaliza evidencias vencidas o rechazadas."
          onExplore={() => setSelectedKpi('Evidencia')}
        />
        <KpiCard
          title="Eficacia"
          value={kpis?.efficacy}
          previousValue={(kpis?.efficacy || 0) - (variation.efficacy || 0)}
          color="#f59e0b"
          icon={CheckCircle2}
          compare={compare}
          tooltip={`Eficacia basada en pruebas. ${kpis?.notTestedCount || 0} controles aún sin probar.`}
          onExplore={() => setSelectedKpi('Eficacia')}
        />
        <KpiCard
          title="Audit Readiness"
          value={kpis?.auditReadiness}
          previousValue={
            (kpis?.auditReadiness || 0) - (variation.auditReadiness || 0)
          }
          color="#10b981"
          icon={ShieldCheck}
          compare={compare}
          tooltip="Cálculo determinista: 30% Imp, 30% Ev, 25% Efi, 15% Acciones. Resta por riesgos críticos."
          onExplore={() => setSelectedKpi('Audit Readiness')}
        />
        <KpiCard
          title="Risk Exposure"
          value={45}
          previousValue={50}
          color="#f43f5e"
          icon={ShieldAlert}
          compare={compare}
          inverseBad={true}
          tooltip="Nivel de exposición global basado en riesgos residuales fuera de tolerancia."
          onExplore={() => setSelectedKpi('Risk Exposure')}
        />
      </div>

      <SlideOver
        isOpen={!!selectedKpi}
        onClose={() => setSelectedKpi(null)}
        title={`Detalle de KPI: ${selectedKpi}`}
        description="Análisis detallado de los componentes que forman este indicador."
      >
        <div className="mt-4">
          {getKpiDetails()}
        </div>
      </SlideOver>
    </>
  );
}
