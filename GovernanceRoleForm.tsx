import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';

interface GovernanceRoleFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function GovernanceRoleForm({ onSuccess, onCancel }: GovernanceRoleFormProps) {
  const { addGovernanceRole, selectedStandard, data } = useStore();
  const { currentOrgId, currentUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    userId: '',
    responsibilities: '',
    authority: '',
    status: 'active',
    processIds: [] as string[],
    standardIds: [selectedStandard],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrgId || !currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const role = {
        organizationId: currentOrgId,
        ...formData,
        assignmentDate: new Date().toISOString(),
      };

      await addGovernanceRole(role);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el rol');
      setLoading(false);
    }
  };

  const handleProcessChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => (option as HTMLOptionElement).value);
    setFormData(prev => ({ ...prev, processIds: selectedOptions }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
          Nombre del Rol *
        </label>
        <input
          type="text"
          id="name"
          required
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="Ej: Oficial de Cumplimiento IA"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
          Descripción del Rol
        </label>
        <textarea
          id="description"
          rows={2}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="Propósito general del rol dentro del sistema de gestión."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-slate-700 mb-1">
          Persona Asignada (Usuario / Cargo) *
        </label>
        <input
          type="text"
          id="userId"
          required
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="Ej: Juan Pérez / Gerencia Legal"
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="responsibilities" className="block text-sm font-medium text-slate-700 mb-1">
            Responsabilidades (RACI: R) *
          </label>
          <textarea
            id="responsibilities"
            required
            rows={4}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="¿De qué tareas operativas o resultados es responsable directo?"
            value={formData.responsibilities}
            onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="authority" className="block text-sm font-medium text-slate-700 mb-1">
            Autoridad / Toma de Decisiones (RACI: A) *
          </label>
          <textarea
            id="authority"
            required
            rows={4}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="¿Qué decisiones puede tomar o vetar? ¿Qué aprueba?"
            value={formData.authority}
            onChange={(e) => setFormData({ ...formData, authority: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="processIds" className="block text-sm font-medium text-slate-700 mb-1">
          Procesos Vinculados
        </label>
        <p className="text-xs text-slate-500 mb-2">Selecciona los procesos en los que este rol interviene (puedes seleccionar varios).</p>
        <select
          id="processIds"
          multiple
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white min-h-[120px]"
          value={formData.processIds}
          onChange={handleProcessChange}
        >
          {data?.processes?.map(p => (
            <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
          Estado del Rol
        </label>
        <select
          id="status"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="active">Activo</option>
          <option value="inactive">Inactivo / Vacante</option>
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
            'Guardar Rol'
          )}
        </button>
      </div>
    </form>
  );
}
