import React, { useState } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useStore } from '../../store/useStore';

export function ProcessWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const { currentOrgId } = useAuth();
  const { fetchData } = useStore();

  const [formData, setFormData] = useState({
    code: '', name: '', type: 'strategic', status: 'draft', site: '', owner: '', backupOwner: '',
    objective: '', description: '', scope: '', criticality: 'medium',
  });

  const handleSave = async () => {
    if (!currentOrgId || !formData.name) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'processes'), {
        organizationId: currentOrgId,
        code: formData.code,
        name: formData.name,
        category: formData.type,
        status: formData.status,
        siteId: formData.site,
        ownerId: formData.owner,
        backupOwnerId: formData.backupOwner,
        objective: formData.objective,
        description: formData.description,
        scope: formData.scope,
        criticality: formData.criticality,
        createdAt: new Date().toISOString()
      });
      if(currentOrgId) fetchData(currentOrgId);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const StepHeader = () => (
    <div className="flex border-b border-slate-200 mb-6 pb-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => (
        <div key={s} className="flex-1 flex flex-col items-center relative">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10 ${step >= s ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
            {s}
          </div>
          {s < 9 && <div className={`absolute top-3 left-1/2 w-full h-0.5 ${step > s ? 'bg-teal-600' : 'bg-slate-100'}`}></div>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center">
          <button onClick={onClose} className="mr-4 text-slate-500 hover:text-slate-800">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-slate-800">Crear Proceso</h2>
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
                  <label className="block text-xs font-medium text-slate-600 mb-1">Código</label>
                  <input type="text" className="w-full border rounded-lg p-2 text-sm" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="Ej. PROC-01" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nombre del Proceso *</label>
                  <input type="text" className="w-full border rounded-lg p-2 text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Tipo / Categoría</label>
                  <select className="w-full border rounded-lg p-2 text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="strategic">Estratégico</option>
                    <option value="mission">Misional / Operativo</option>
                    <option value="support">Apoyo</option>
                    <option value="control">Control / Evaluación</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Estado</label>
                  <select className="w-full border rounded-lg p-2 text-sm" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="draft">Borrador</option>
                    <option value="active">Activo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Responsable Principal</label>
                  <input type="text" className="w-full border rounded-lg p-2 text-sm" value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Responsable Suplente</label>
                  <input type="text" className="w-full border rounded-lg p-2 text-sm" value={formData.backupOwner} onChange={e => setFormData({...formData, backupOwner: e.target.value})} />
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Paso 2: Propósito y Alcance</h3>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Objetivo del Proceso</label>
                <textarea className="w-full border rounded-lg p-2 text-sm h-20" value={formData.objective} onChange={e => setFormData({...formData, objective: e.target.value})} placeholder="¿Para qué existe el proceso?"></textarea>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Descripción</label>
                <textarea className="w-full border rounded-lg p-2 text-sm h-20" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Criticidad</label>
                <select className="w-full border rounded-lg p-2 text-sm" value={formData.criticality} onChange={e => setFormData({...formData, criticality: e.target.value})}>
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
              </div>
            </div>
          )}

          {step > 2 && step < 9 && (
            <div className="flex flex-col items-center justify-center py-12 animate-in fade-in">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                {step}
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Paso {step}</h3>
              <p className="text-sm text-slate-500 text-center max-w-sm">Esta sección de caracterización avanzada estará disponible en la próxima actualización. Puede continuar al paso final para guardar los datos básicos.</p>
            </div>
          )}
          
          {step === 9 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Paso 9: Revisión y Finalización</h3>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-600 mb-4">El proceso <strong>{formData.name || 'Sin nombre'}</strong> se guardará en estado <strong>{formData.status === 'active' ? 'Activo' : 'Borrador'}</strong>.</p>
                <p className="text-sm text-slate-600 mb-6">Podrá enriquecer la caracterización, añadir actividades, indicadores y riesgos posteriormente desde la vista Process 360.</p>
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
        {step < 9 ? (
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
            {saving ? 'Guardando...' : 'FINALIZAR Y CREAR'}
          </button>
        )}
      </div>
    </div>
  );
}
