import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';

interface RiskFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function RiskForm({ onSuccess, onCancel }: RiskFormProps) {
  const { addRisk, selectedStandard } = useStore();
  const { currentOrgId, currentUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Seguridad de la Información',
    level: 'Medio',
    status: 'Identificado',
    description: '',
    standardIds: [selectedStandard],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrgId || !currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const risk = {
        organizationId: currentOrgId,
        name: formData.name,
        description: formData.description,
        type: formData.type,
        level: formData.level,
        status: formData.status,
        identifiedDate: new Date().toISOString(),
        reportedBy: currentUser.displayName || currentUser.email || 'Sistema',
        standardIds: formData.standardIds,
      };

      await addRisk(risk);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el Riesgo');
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
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
          Nombre del Riesgo *
        </label>
        <input
          type="text"
          id="name"
          required
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="Ej: Fuga de datos confidenciales por uso de IA pública"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
          Descripción del Escenario (Opcional)
        </label>
        <textarea
          id="description"
          rows={3}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="Describe la vulnerabilidad y la amenaza que podrían explotarla."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">
            Categoría
          </label>
          <select
            id="type"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="Seguridad de la Información">Seguridad de la Información</option>
            <option value="Sistemas de IA">Sistemas de IA</option>
            <option value="Privacidad de Datos">Privacidad de Datos</option>
            <option value="Técnico / Infraestructura">Técnico / Infraestructura</option>
            <option value="Reputacional">Reputacional</option>
            <option value="Legal y Cumplimiento">Legal y Cumplimiento</option>
          </select>
        </div>

        <div>
          <label htmlFor="level" className="block text-sm font-medium text-slate-700 mb-1">
            Nivel (Inherente)
          </label>
          <select
            id="level"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
          >
            <option value="Bajo">Bajo</option>
            <option value="Medio">Medio</option>
            <option value="Alto">Alto</option>
            <option value="Crítico">Crítico</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
          Estado Inicial de Tratamiento
        </label>
        <select
          id="status"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="Identificado">Identificado (Sin Plan)</option>
          <option value="En Tratamiento">En Tratamiento</option>
          <option value="Aceptado">Aceptado (Riesgo Residual Permitido)</option>
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
            'Registrar Riesgo'
          )}
        </button>
      </div>
    </form>
  );
}
