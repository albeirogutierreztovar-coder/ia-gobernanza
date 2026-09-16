import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';
import { NonConformity, NonConformityStatus } from '../../types';

interface NonConformityFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  defaultSource?: 'Auditoría' | 'Incidente' | 'Revisión por la Dirección' | 'Otro';
}

export function NonConformityForm({ onSuccess, onCancel, defaultSource = 'Auditoría' }: NonConformityFormProps) {
  const { addNonConformity, selectedStandard } = useStore();
  const { currentOrgId, currentUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    source: defaultSource,
    severity: 'Media' as NonConformity['severity'],
    standardIds: [selectedStandard],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrgId || !currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const nc = {
        organizationId: currentOrgId,
        title: formData.title,
        description: formData.description,
        source: formData.source,
        severity: formData.severity,
        status: 'Abierta' as NonConformityStatus,
        identifiedDate: new Date().toISOString(),
        reportedBy: currentUser.displayName || currentUser.email || 'Sistema',
        standardIds: formData.standardIds,
        capaIds: []
      };

      await addNonConformity(nc);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la No Conformidad');
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

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
          Título de la No Conformidad *
        </label>
        <input
          type="text"
          id="title"
          required
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="Ej: Falla en el control de acceso biométrico"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
          Descripción Detallada *
        </label>
        <textarea
          id="description"
          required
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="Describe qué ocurrió, dónde y por qué se considera una desviación de la norma."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-slate-700 mb-1">
            Origen
          </label>
          <select
            id="source"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
          >
            <option value="Auditoría">Auditoría</option>
            <option value="Incidente">Incidente de Seguridad</option>
            <option value="Revisión por la Dirección">Revisión por la Dirección</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label htmlFor="severity" className="block text-sm font-medium text-slate-700 mb-1">
            Severidad
          </label>
          <select
            id="severity"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
          >
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
            <option value="Crítica">Crítica</option>
          </select>
        </div>
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
            'Registrar No Conformidad'
          )}
        </button>
      </div>
    </form>
  );
}
