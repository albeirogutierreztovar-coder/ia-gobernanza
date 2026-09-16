import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';

interface StakeholderFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function StakeholderForm({ onSuccess, onCancel }: StakeholderFormProps) {
  const { addStakeholder, selectedStandard } = useStore();
  const { currentOrgId, currentUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Clientes',
    internalExternal: 'External',
    description: '',
    needs: '',
    expectations: '',
    requirements: '',
    legalRequirements: '',
    contractualRequirements: '',
    status: 'active',
    standardIds: [selectedStandard],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrgId || !currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const stakeholder = {
        organizationId: currentOrgId,
        ...formData,
      };

      await addStakeholder(stakeholder);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la parte interesada');
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Nombre de la Parte Interesada *
          </label>
          <input
            type="text"
            id="name"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Ej: Autoridades Reguladoras de Datos"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
            Categoría *
          </label>
          <select
            id="category"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="Alta Dirección">Alta Dirección</option>
            <option value="Empleados">Empleados</option>
            <option value="Clientes">Clientes</option>
            <option value="Usuarios">Usuarios</option>
            <option value="Proveedores">Proveedores</option>
            <option value="Proveedores IA">Proveedores IA</option>
            <option value="Socios">Socios</option>
            <option value="Autoridades">Autoridades</option>
            <option value="Reguladores">Reguladores</option>
            <option value="Comunidad">Comunidad</option>
            <option value="Sociedad">Sociedad</option>
            <option value="Otros">Otros</option>
          </select>
        </div>

        <div>
          <label htmlFor="internalExternal" className="block text-sm font-medium text-slate-700 mb-1">
            Tipo *
          </label>
          <select
            id="internalExternal"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
            value={formData.internalExternal}
            onChange={(e) => setFormData({ ...formData, internalExternal: e.target.value })}
          >
            <option value="Internal">Interno</option>
            <option value="External">Externo</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          rows={2}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="Descripción del contexto de esta parte interesada."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="needs" className="block text-sm font-medium text-slate-700 mb-1">
            Necesidades
          </label>
          <textarea
            id="needs"
            rows={2}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Ej: Información precisa y oportuna sobre incidentes de seguridad."
            value={formData.needs}
            onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="expectations" className="block text-sm font-medium text-slate-700 mb-1">
            Expectativas
          </label>
          <textarea
            id="expectations"
            rows={2}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Ej: Respuestas en menos de 24 horas ante consultas."
            value={formData.expectations}
            onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="legalRequirements" className="block text-sm font-medium text-slate-700 mb-1">
            Requisitos Legales
          </label>
          <textarea
            id="legalRequirements"
            rows={2}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Ej: Cumplimiento de la Ley 81 de Protección de Datos."
            value={formData.legalRequirements}
            onChange={(e) => setFormData({ ...formData, legalRequirements: e.target.value })}
          />
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
            'Guardar Parte Interesada'
          )}
        </button>
      </div>
    </form>
  );
}
