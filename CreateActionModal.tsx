import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export function CreateActionModal({ onClose, gaps, onRefresh }: { onClose: () => void, gaps: any[], onRefresh: () => void }) {
  const { currentOrgId } = useAuth();
  const [selectedGaps, setSelectedGaps] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIA');
  const [owner, setOwner] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleGap = (id: string) => {
    setSelectedGaps(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  const handleSave = async () => {
    if (!currentOrgId || !title || !dueDate) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'implementationActions'), {
        organizationId: currentOrgId,
        title,
        description,
        priority,
        ownerId: owner || 'Sin asignar',
        status: 'PENDIENTE',
        dueDate: new Date(dueDate).toISOString(),
        requirementIds: selectedGaps
      });
      onRefresh();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Crear Plan desde Brechas</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-200 pb-2">Detalles de la Acción</h3>
            
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Título de la Acción *</label>
              <input 
                type="text" 
                className="w-full bg-white border border-slate-300 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ej. Definir matriz de comunicaciones"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Descripción</label>
              <textarea 
                className="w-full bg-white border border-slate-300 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 h-24"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Prioridad</label>
                <select 
                  className="w-full bg-white border border-slate-300 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                >
                  <option>BAJA</option>
                  <option>MEDIA</option>
                  <option>ALTA</option>
                  <option>CRÍTICA</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Fecha Límite *</label>
                <input 
                  type="date" 
                  className="w-full bg-white border border-slate-300 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Responsable</label>
              <input 
                type="text" 
                className="w-full bg-white border border-slate-300 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                value={owner}
                onChange={e => setOwner(e.target.value)}
                placeholder="Nombre del responsable"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-200 pb-2">Vincular Brechas ({selectedGaps.length})</h3>
            
            {gaps.length === 0 ? (
              <div className="text-center p-6 border border-slate-200 border-dashed rounded-lg bg-slate-50">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No hay brechas abiertas identificadas actualmente.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {gaps.map(gap => (
                  <label key={gap.id || gap.requirementId} className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${selectedGaps.includes(gap.requirementId) ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                    <input 
                      type="checkbox" 
                      className="mt-1 rounded text-teal-600 focus:ring-teal-500 border-slate-300 mr-3"
                      checked={selectedGaps.includes(gap.requirementId)}
                      onChange={() => toggleGap(gap.requirementId)}
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-700">{gap.standard} • {gap.requirementId}</p>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{gap.title || gap.gapDescription || 'Brecha identificada'}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
          <button 
            onClick={handleSave} 
            disabled={saving || !title || !dueDate}
            className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Creando...' : 'Crear Acción'}
          </button>
        </div>
      </div>
    </div>
  );
}
