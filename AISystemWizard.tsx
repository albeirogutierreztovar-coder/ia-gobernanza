import React, { useState } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useStore } from '../../store/useStore';

export function AISystemWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const { currentOrgId } = useAuth();
  const { addAISystem } = useStore();

  const [formData, setFormData] = useState({
    code: '', name: '', type: 'AI_ASSISTANT', description: '',
    process: '', ownerId: '', purpose: '', intendedUse: '', users: '',
    providerName: '', modelName: '', modelVersion: '', deploymentEnvironment: 'cloud',
    personalData: false, sensitiveData: false, confidentialData: false,
    autonomyLevel: 'ADVISORY', humanOversightLevel: 'High', humanOverrideAvailable: true,
    riskLevel: 'medium', classification: 'pending_classification', approvalStatus: 'draft'
  });

  const handleSave = async () => {
    if (!currentOrgId || !formData.name) return;
    setSaving(true);
    try {
      await addAISystem({
        organizationId: currentOrgId,
        ...formData,
        lifecycleStage: 'EVALUATION',
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const StepHeader = () => (
    <div className="flex border-b border-slate-200 mb-6 pb-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
        <div key={s} className="flex-1 flex flex-col items-center relative">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10 ${step >= s ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
            {s}
          </div>
          {s < 8 && <div className={`absolute top-3 left-1/2 w-full h-0.5 ${step > s ? 'bg-teal-600' : 'bg-slate-100'}`}></div>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-xl flex flex-col h-full">
      <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center">
          <button onClick={onClose} className="mr-4 text-slate-500 hover:text-slate-800">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-slate-800">Registrar Sistema IA</h2>
        </div>
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
          GUARDAR BORRADOR
        </button>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
        <StepHeader />
        
        <div className="max-w-3xl mx-auto mt-8">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Paso 1: Identificación</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nombre del Sistema IA *</label>
                  <input type="text" className="w-full border rounded-lg p-2 text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Código</label>
                  <input type="text" className="w-full border rounded-lg p-2 text-sm" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="Ej. AI-001" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Tipo de Componente</label>
                  <select className="w-full border rounded-lg p-2 text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="AI_ASSISTANT">Asistente IA (Copilot)</option>
                    <option value="AI_AGENT">Agente Autónomo</option>
                    <option value="AI_MODEL">Modelo ML/DL</option>
                    <option value="AI_APPLICATION">Aplicación Empaquetada con IA</option>
                    <option value="MLOPS_PIPELINE">Pipeline MLOps</option>
                    <option value="OTHER_AI_COMPONENT">Otro</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Descripción General</label>
                  <textarea className="w-full border rounded-lg p-2 text-sm h-20" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Paso 2: Proceso y Finalidad</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Proceso Principal</label>
                  <input type="text" className="w-full border rounded-lg p-2 text-sm" value={formData.process} onChange={e => setFormData({...formData, process: e.target.value})} placeholder="Ej. Servicio al Cliente" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Propietario del Sistema</label>
                  <input type="text" className="w-full border rounded-lg p-2 text-sm" value={formData.ownerId} onChange={e => setFormData({...formData, ownerId: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Finalidad Principal</label>
                  <textarea className="w-full border rounded-lg p-2 text-sm h-16" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})}></textarea>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Uso Previsto (Instrucciones)</label>
                  <textarea className="w-full border rounded-lg p-2 text-sm h-16" value={formData.intendedUse} onChange={e => setFormData({...formData, intendedUse: e.target.value})}></textarea>
                </div>
              </div>
            </div>
          )}

          {step > 2 && step < 8 && (
            <div className="flex flex-col items-center justify-center py-12 animate-in fade-in">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                {step}
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Paso {step}</h3>
              <p className="text-sm text-slate-500 text-center max-w-sm">
                En esta demo rápida puede continuar para guardar los datos básicos. La vista completa de AI 360 le permitirá rellenar datos, proveedores, autonomía y riesgo.
              </p>
            </div>
          )}
          
          {step === 8 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Paso 8: Revisión y Aprobación Inicial</h3>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-600 mb-4">El sistema <strong>{formData.name || 'Sin nombre'}</strong> se creará en el AI Registry.</p>
                <p className="text-sm text-slate-600 mb-6">Será necesario completar la evaluación de impacto y el registro de datos antes de solicitar su aprobación final para producción.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
        <button 
          onClick={() => setStep(prev => Math.max(1, prev - 1))}
          disabled={step === 1}
          className="px-6 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50"
        >
          Anterior
        </button>
        {step < 8 ? (
          <button 
            onClick={() => setStep(prev => prev + 1)}
            className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center"
          >
            Continuar <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        ) : (
          <button 
            onClick={handleSave}
            disabled={saving || !formData.name}
            className="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'ENVIAR A EVALUACIÓN'}
          </button>
        )}
      </div>
    </div>
  );
}
