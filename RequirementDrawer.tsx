import React, { useState } from 'react';
import { X, Bot, Shield, FileText, CheckCircle2, ChevronRight, History, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { doc, setDoc, updateDoc, arrayUnion, addDoc, collection } from 'firebase/firestore';

export function RequirementDrawer({ requirement, onClose, onRefresh }: { requirement: any, onClose: () => void, onRefresh: () => void }) {
  const { currentOrgId, user } = useAuth();
  const { data } = useStore();
  
  // Basic AI Check for ISO 42001 AI Impact Assessment
  const isAIAssessmentReq = requirement?.standard === 'ISO 42001' && (requirement?.clause?.startsWith('8.2') || requirement?.title?.toLowerCase().includes('impacto'));
  const aiSystems = data?.aiSystems || [];
  const impacts = data?.aiImpactAssessments || [];
  const systemsWithoutImpact = aiSystems.filter(sys => !impacts.some(imp => imp.aiSystemId === sys.id));
  const showAIWarning = isAIAssessmentReq && systemsWithoutImpact.length > 0;

  const [status, setStatus] = useState(requirement.status || 'not_evaluated');
  const [ownerId, setOwnerId] = useState(requirement.ownerId || 'Sin asignar');
  const [saving, setSaving] = useState(false);
  const [aiMessage, setAiMessage] = useState('');

  if (!requirement) return null;

  const handleSave = async () => {
    if (!currentOrgId) return;
    setSaving(true);
    try {
      const assessmentRef = requirement.assessmentId 
        ? doc(db, 'requirementAssessments', requirement.assessmentId)
        : doc(collection(db, 'requirementAssessments'));
      
      const newData = {
        organizationId: currentOrgId,
        standard: requirement.standard,
        clause: requirement.clause,
        requirementId: requirement.requirement,
        status,
        ownerId,
        updatedAt: new Date().toISOString()
      };

      await setDoc(assessmentRef, newData, { merge: true });

      // Record history
      if (requirement.status !== status || requirement.ownerId !== ownerId) {
        await addDoc(collection(db, 'assessmentHistory'), {
          organizationId: currentOrgId,
          requirementId: requirement.requirement,
          date: new Date().toISOString(),
          userId: user?.uid || 'unknown',
          userName: user?.displayName || user?.email || 'Unknown User',
          field: requirement.status !== status ? 'status' : 'ownerId',
          oldValue: requirement.status !== status ? requirement.status : requirement.ownerId,
          newValue: requirement.status !== status ? status : ownerId,
        });
      }

      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error saving assessment:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <div className="flex items-center text-xs font-medium text-slate-500 mb-1">
              {requirement.standard} <ChevronRight className="w-3 h-3 mx-1" /> Cláusula {requirement.clause}
            </div>
            <h2 className="text-lg font-bold text-slate-800">Requisito {requirement.requirement || requirement.clause}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">¿QUÉ SIGNIFICA?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{requirement.description || requirement.title}</p>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-5 border border-teal-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-teal-900 flex items-center">
                <Bot className="w-4 h-4 mr-2" /> Asistente IA
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setAiMessage("Conectando con el Agente AI... (Módulo en construcción)")} className="px-3 py-1.5 bg-white text-teal-700 text-xs font-medium rounded-lg border border-teal-200 hover:bg-teal-50 hover:border-teal-300 transition-all shadow-sm">Explícame este requisito</button>
              <button onClick={() => setAiMessage("Conectando con el Agente AI... (Módulo en construcción)")} className="px-3 py-1.5 bg-white text-teal-700 text-xs font-medium rounded-lg border border-teal-200 hover:bg-teal-50 hover:border-teal-300 transition-all shadow-sm">Sugiere acciones</button>
              <button onClick={() => setAiMessage("Conectando con el Agente AI... (Módulo en construcción)")} className="px-3 py-1.5 bg-white text-teal-700 text-xs font-medium rounded-lg border border-teal-200 hover:bg-teal-50 hover:border-teal-300 transition-all shadow-sm">Sugiere evidencias</button>

            </div>
            {aiMessage && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-teal-100 text-xs text-teal-800 flex items-center justify-between">
                <span>{aiMessage}</span>
                <button onClick={() => setAiMessage('')} className="text-teal-500 hover:text-teal-700"><X className="w-4 h-4"/></button>
              </div>
            )}
          </div>



          {showAIWarning && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start">
              <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-800">Evaluaciones de Impacto Faltantes</h4>
                <p className="text-xs text-amber-700 mt-1">
                  Existen <strong>{systemsWithoutImpact.length} sistemas IA</strong> en el inventario sin una evaluación de impacto registrada. 
                  Este requisito no debería considerarse completamente implementado hasta evaluarlos.
                </p>
                <div className="mt-2 text-xs font-semibold text-amber-800">Sistemas pendientes:</div>
                <ul className="list-disc list-inside text-xs text-amber-700 mt-1">
                  {systemsWithoutImpact.slice(0, 3).map(s => <li key={s.id}>{s.name}</li>)}
                  {systemsWithoutImpact.length > 3 && <li>...y {systemsWithoutImpact.length - 3} más</li>}
                </ul>
              </div>
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">ESTADO ACTUAL</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Estado de Implementación</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="not_evaluated">No evaluado</option>
                  <option value="gap">Brecha / No existe</option>
                  <option value="planned">Planeado</option>
                  <option value="documented">Documentado</option>
                  <option value="implemented">Implementado</option>
                  <option value="implemented_maintained">Implementado y mantenido</option>
                  <option value="verified">Verificado</option>
                  <option value="not_applicable">No aplica</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Responsable</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow"
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                >
                  <option value="Sin asignar">Sin asignar</option>
                  <option value="Ana Martínez">Ana Martínez</option>
                  <option value="Carlos Ruiz">Carlos Ruiz</option>
                  <option value="Luis Gómez">Luis Gómez</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-4 border-b border-slate-200 pb-2">
              <h3 className="text-sm font-semibold text-slate-800">EVIDENCIAS</h3>
              <span className="text-xs font-medium text-slate-400">0 vinculadas</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-6 text-center">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500 mb-4">No hay evidencias vinculadas a este requisito.</p>
              <div className="flex justify-center gap-3">
                <button 
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-500 text-sm font-medium rounded-lg cursor-not-allowed opacity-70"
                  title="Evidence Vault estará disponible próximamente"
                >
                  VINCULAR EXISTENTE
                </button>
                <button 
                  className="px-4 py-2 bg-slate-100 text-slate-400 text-sm font-medium rounded-lg cursor-not-allowed opacity-70"
                  title="Evidence Vault estará disponible próximamente"
                >
                  SUBIR EVIDENCIA
                </button>
              </div>
            </div>
          </div>

        </div>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
          <button className="flex items-center text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors">
            <History className="w-4 h-4 mr-1" /> Ver historial
          </button>
          <div className="flex space-x-3">
            <button onClick={onClose} className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-70 flex items-center"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Guardando...
                </>
              ) : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
