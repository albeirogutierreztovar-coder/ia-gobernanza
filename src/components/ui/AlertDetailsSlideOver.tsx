import React, { useState } from 'react';
import { SlideOver } from './SlideOver';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  ArrowRight, 
  Shield, 
  Cpu, 
  FileText, 
  Clock, 
  RotateCcw,
  Check,
  ExternalLink
} from 'lucide-react';
import { Alert } from '../../types';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';

interface AlertDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  alert: Alert | null;
}

export function AlertDetailsSlideOver({ isOpen, onClose, alert }: AlertDetailsProps) {
  const { resolveAlert, unresolveAlert, addCapa } = useStore();
  const navigate = useNavigate();
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [capaSuccess, setCapaSuccess] = useState(false);

  if (!alert) return null;

  const handleResolve = async () => {
    setIsResolving(true);
    await resolveAlert(alert.id, resolutionNotes || 'Marcada como resuelta desde el panel de detalles.');
    setIsResolving(false);
    onClose();
  };

  const handleUnresolve = async () => {
    await unresolveAlert(alert.id);
    onClose();
  };

  const handleCreateCapa = async () => {
    await addCapa({
      organizationId: 'org-nova',
      title: `Tratamiento Alerta: ${alert.message.slice(0, 60)}...`,
      type: alert.type === 'CRÍTICO' ? 'Correctiva' : 'Preventiva',
      source: `Alerta del Sistema (${alert.type})`,
      standard: alert.standard || 'ISO/IEC 27001',
      description: alert.description || alert.message,
      rootCause: 'Identificado automáticamente por el motor de monitoreo de gobernanza.',
      actions: alert.suggestedAction || 'Definir plan de remediación y verificación de efectividad.',
      owner: 'Oficial de Seguridad & IA',
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: 'Abierta',
      progress: 0
    });
    setCapaSuccess(true);
    setTimeout(() => {
      setCapaSuccess(false);
      navigate('/implementation');
    }, 1200);
  };

  const getSourcePath = () => {
    if (alert.sourceType === 'risk') return '/risks';
    if (alert.sourceType === 'ai_system') return '/ai-registry';
    if (alert.sourceType === 'control') return '/control-center';
    if (alert.sourceType === 'audit') return '/audit';
    return null;
  };

  const sourcePath = getSourcePath();

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Alerta"
      description="Inspección detallada de la anomalía, cláusula afectada y opciones de resolución."
    >
      <div className="mt-4 space-y-6" id="alert-slideover-content">
        {/* Main Alert Card */}
        <div className={`p-4 rounded-xl border ${
          alert.type === 'CRÍTICO' ? 'bg-rose-50/70 border-rose-200 text-rose-950' :
          alert.type === 'ALTO' ? 'bg-orange-50/70 border-orange-200 text-orange-950' :
          'bg-amber-50/70 border-amber-200 text-amber-950'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {alert.type === 'CRÍTICO' && <AlertTriangle className="w-5 h-5 text-rose-600" />}
              {alert.type === 'ALTO' && <AlertCircle className="w-5 h-5 text-orange-600" />}
              {alert.type === 'MEDIO' && <Info className="w-5 h-5 text-amber-600" />}
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 border ${
                alert.type === 'CRÍTICO' ? 'border-rose-300 text-rose-700' :
                alert.type === 'ALTO' ? 'border-orange-300 text-orange-700' :
                'border-amber-300 text-amber-700'
              }`}>
                Severidad {alert.type}
              </span>
            </div>
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {alert.date}
            </span>
          </div>

          <p className="font-semibold text-slate-900 leading-snug text-base mb-1">
            {alert.message}
          </p>

          {alert.description && (
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {alert.description}
            </p>
          )}

          {alert.resolved && (
            <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center text-xs font-medium text-emerald-700 gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Resuelta por {alert.resolvedBy || 'Oficial de Seguridad'} ({alert.resolvedAt || 'Previamente'})</span>
            </div>
          )}
        </div>

        {/* Normative Context Section */}
        <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-600" />
            Contexto Normativo y Trazabilidad
          </h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block font-medium">Estándar Aplicable</span>
              <span className="text-slate-800 font-semibold mt-0.5 block">{alert.standard || 'Sistema Integrado'}</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block font-medium">Categoría de Hallazgo</span>
              <span className="text-slate-800 font-semibold mt-0.5 block">{alert.category || 'Gobernanza'}</span>
            </div>
          </div>

          {alert.clause && (
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
              <span className="text-slate-400 block font-medium">Cláusula / Control Relacionado</span>
              <span className="text-slate-900 font-semibold mt-0.5 block font-mono">{alert.clause}</span>
            </div>
          )}

          {alert.suggestedAction && (
            <div className="p-3 bg-teal-50/60 rounded-lg border border-teal-100 text-xs">
              <span className="text-teal-800 font-bold block mb-1">Acción Correctiva Sugerida:</span>
              <p className="text-teal-900 leading-relaxed">{alert.suggestedAction}</p>
            </div>
          )}
        </div>

        {/* Action Buttons & Workflow */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Gestión y Tratamiento del Hallazgo
          </h4>

          {!alert.resolved ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Notas de resolución / Justificación técnica (opcional):
                </label>
                <textarea
                  rows={2}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Ej. Evidencia actualizada y verificada por el comité de riesgos..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  id="btn-slideover-resolve"
                  onClick={handleResolve}
                  disabled={isResolving}
                  className="flex items-center justify-center px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  {isResolving ? 'Resolviendo...' : 'Marcar como Resuelta'}
                </button>

                <button
                  type="button"
                  id="btn-slideover-create-capa"
                  onClick={handleCreateCapa}
                  className="flex items-center justify-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors shadow-sm"
                >
                  <FileText className="w-4 h-4 mr-1.5" />
                  {capaSuccess ? 'Plan CAPA Creado' : 'Abrir Plan CAPA'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <p className="text-xs text-slate-600">
                Esta alerta se encuentra actualmente registrada como resuelta. Si el riesgo reapareció o la evidencia fue rechazada, puede reabrirla.
              </p>
              <button
                type="button"
                onClick={handleUnresolve}
                className="w-full flex items-center justify-center px-3 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                Reabrir Alerta (Marcar como Pendiente)
              </button>
            </div>
          )}

          {sourcePath && (
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(sourcePath);
              }}
              className="w-full flex items-center justify-center px-4 py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-lg font-medium text-xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-2 text-teal-600" />
              Navegar al Módulo del Elemento Afectado
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          )}
        </div>
      </div>
    </SlideOver>
  );
}

