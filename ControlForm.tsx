import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { NormativeControl } from '../../types';
import { AlertCircle } from 'lucide-react';

interface ControlFormProps {
  control: NormativeControl;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ControlForm({ control, onSuccess, onCancel }: ControlFormProps) {
  const { updateNormativeControl } = useStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    applicable: control.applicable,
    justification: control.justification || '',
    implementationStatus: control.implementationStatus,
    maturityLevel: control.maturityLevel,
    ownerId: control.ownerId || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Si no aplica, se requiere justificación obligatoriamente
    if (!formData.applicable && !formData.justification.trim()) {
      setError('Debes proporcionar una justificación para excluir el control.');
      setLoading(false);
      return;
    }

    try {
      await updateNormativeControl(control.id, {
        applicable: formData.applicable,
        justification: formData.justification,
        implementationStatus: formData.applicable ? formData.implementationStatus : 'No Implementado',
        maturityLevel: formData.applicable ? formData.maturityLevel : 0,
        ownerId: formData.ownerId,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el control');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
        <h3 className="text-sm font-bold text-slate-800 mb-1">{control.code}: {control.name}</h3>
        <p className="text-sm text-slate-600 line-clamp-3">{control.description}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div>
            <label className="text-sm font-medium text-slate-800">¿Aplica este control?</label>
            <p className="text-xs text-slate-500 mt-0.5">Determina si es requerido por el alcance de la organización.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={formData.applicable}
              onChange={(e) => setFormData({ ...formData, applicable: e.target.checked })}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>

        {!formData.applicable && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Justificación de Exclusión (Obligatorio)
            </label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Explica detalladamente por qué este control no aplica a la organización..."
              value={formData.justification}
              onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
            />
          </div>
        )}

        {formData.applicable && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Estado de Implementación
                </label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                  value={formData.implementationStatus}
                  onChange={(e) => setFormData({ ...formData, implementationStatus: e.target.value as any })}
                >
                  <option value="No Implementado">No Implementado</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Implementado">Implementado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nivel de Madurez (0-5)
                </label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                  value={formData.maturityLevel}
                  onChange={(e) => setFormData({ ...formData, maturityLevel: parseInt(e.target.value) as any })}
                >
                  <option value="0">0 - Inexistente</option>
                  <option value="1">1 - Inicial / Ad-Hoc</option>
                  <option value="2">2 - Gestionado</option>
                  <option value="3">3 - Definido</option>
                  <option value="4">4 - Medido y Controlado</option>
                  <option value="5">5 - Optimizado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Responsable del Control (Owner)
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Nombre o Rol del Responsable"
                value={formData.ownerId}
                onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
              />
            </div>

            {formData.applicable && formData.justification && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notas / Justificación de Aplicación
                </label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Información adicional sobre cómo se aplica este control..."
                  value={formData.justification}
                  onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-slate-200 flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Evaluación'}
        </button>
      </div>
    </form>
  );
}
