import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';

interface ObjectiveFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ObjectiveForm({ onSuccess, onCancel }: ObjectiveFormProps) {
  const { addObjective, selectedStandard } = useStore();
  const { currentOrgId, currentUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    expectedOutcome: '',
    ownerId: currentUser?.displayName || currentUser?.email || 'Sistema',
    status: 'on_track',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    standardIds: [selectedStandard],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrgId || !currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const obj = {
        organizationId: currentOrgId,
        code: formData.code,
        name: formData.name,
        description: formData.description,
        expectedOutcome: formData.expectedOutcome,
        ownerId: formData.ownerId,
        status: formData.status,
        startDate: new Date(formData.startDate).toISOString(),
        dueDate: new Date(formData.dueDate).toISOString(),
        standardIds: formData.standardIds,
      };

      await addObjective(obj);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el objetivo');
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

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="sm:col-span-1">
          <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-1">
            Código *
          </label>
          <input
            type="text"
            id="code"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="OBJ-01"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </div>
        
        <div className="sm:col-span-3">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Nombre del Objetivo *
          </label>
          <input
            type="text"
            id="name"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Ej: Incrementar madurez en seguridad"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
          Descripción Detallada
        </label>
        <textarea
          id="description"
          rows={3}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="Describe la intención, alcance y contexto del objetivo."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="expectedOutcome" className="block text-sm font-medium text-slate-700 mb-1">
          Resultado Esperado
        </label>
        <input
          type="text"
          id="expectedOutcome"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="Ej: Alcanzar Nivel 4 de madurez"
          value={formData.expectedOutcome}
          onChange={(e) => setFormData({ ...formData, expectedOutcome: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1">
            Fecha de Inicio
          </label>
          <input
            type="date"
            id="startDate"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 mb-1">
            Fecha de Cumplimiento Límite
          </label>
          <input
            type="date"
            id="dueDate"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="ownerId" className="block text-sm font-medium text-slate-700 mb-1">
          Responsable
        </label>
        <input
          type="text"
          id="ownerId"
          required
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          value={formData.ownerId}
          onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
          Estado
        </label>
        <select
          id="status"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="draft">Borrador</option>
          <option value="active">Activo</option>
          <option value="on_track">En Curso (On Track)</option>
          <option value="at_risk">En Riesgo (At Risk)</option>
          <option value="off_track">Atrasado (Off Track)</option>
          <option value="completed">Completado</option>
        </select>
      </div>

      {/* Buttons */}
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
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </span>
          ) : (
            'Guardar Objetivo'
          )}
        </button>
      </div>
    </form>
  );
}
