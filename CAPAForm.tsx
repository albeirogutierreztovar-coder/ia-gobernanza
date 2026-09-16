import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';

interface CAPAFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  defaultNcId?: string;
}

export function CAPAForm({ onSuccess, onCancel, defaultNcId = '' }: CAPAFormProps) {
  const { addCapa, data } = useStore();
  const { currentOrgId, currentUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Correctiva',
    nonConformityId: defaultNcId,
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days from now
    ownerId: currentUser?.displayName || currentUser?.email || 'Sistema',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrgId || !currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const capa = {
        organizationId: currentOrgId,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: 'Planeada',
        nonConformityId: formData.nonConformityId || null,
        ownerId: formData.ownerId,
        dueDate: new Date(formData.dueDate).toISOString(),
      };

      await addCapa(capa);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la acción CAPA');
      setLoading(false);
    }
  };

  const openNcs = data?.nonConformities?.filter(nc => nc.status !== 'Cerrada') || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
          Título de la Acción *
        </label>
        <input
          type="text"
          id="title"
          required
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="Ej: Actualizar política de control de accesos"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
          Plan de Acción Detallado *
        </label>
        <textarea
          id="description"
          required
          rows={3}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="Describe los pasos exactos para implementar esta acción y prevenir recurrencia."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">
            Tipo de Acción
          </label>
          <select
            id="type"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="Correctiva">Correctiva (Eliminar causa raíz)</option>
            <option value="Preventiva">Preventiva (Evitar que ocurra)</option>
            <option value="Mejora">Mejora (Optimización)</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 mb-1">
            Fecha Límite
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
        <label htmlFor="nonConformityId" className="block text-sm font-medium text-slate-700 mb-1">
          Asociar a No Conformidad (Opcional)
        </label>
        <select
          id="nonConformityId"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
          value={formData.nonConformityId}
          onChange={(e) => setFormData({ ...formData, nonConformityId: e.target.value })}
        >
          <option value="">-- Sin asociar --</option>
          {openNcs.map(nc => (
            <option key={nc.id} value={nc.id}>
              {nc.title} ({nc.status})
            </option>
          ))}
        </select>
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
            'Registrar CAPA'
          )}
        </button>
      </div>
    </form>
  );
}
