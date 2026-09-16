import React, { useState } from 'react';
import { DashboardData, GovernanceRole } from '../../types';
import { Shield, Plus, Search, User, ShieldCheck, Link2 } from 'lucide-react';
import { SlideOver } from '../ui/SlideOver';
import { GovernanceRoleForm } from '../forms/GovernanceRoleForm';

export function RolesTab({ data, standard = 'Integrado' }: { data: DashboardData, standard?: string }) {
  let roles = data.governanceRoles || [];
  if (standard !== 'Integrado') {
    roles = roles.filter(r => r.standardIds?.includes(standard));
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<GovernanceRole | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filtered = roles.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
      <div className="flex justify-between items-center p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">Roles y Responsabilidades</h2>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar rol..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-64"
            />
          </div>
          
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            AGREGAR ROL
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <p className="text-sm text-slate-500 mb-4">No existen roles registrados.</p>
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              AGREGAR ROL
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(role => (
              <div key={role.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 hover:border-teal-300 transition-colors cursor-pointer" onClick={() => setSelectedRole(role)}>
                <div className="flex justify-between items-start mb-2">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${role.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                    {role.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 mt-2">{role.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{role.description || 'Sin descripción'}</p>
                
                <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-600 flex items-center">
                    <User className="w-3.5 h-3.5 mr-1" />
                    {role.userId || 'Sin asignar'}
                  </span>
                  <button className="text-xs font-semibold text-teal-600 hover:text-teal-800">
                    VER DETALLES
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SlideOver
        isOpen={!!selectedRole}
        onClose={() => setSelectedRole(null)}
        title="Detalles del Rol"
        description="Responsabilidades y autoridades asignadas al rol."
      >
        {selectedRole && (
          <div className="mt-4 space-y-6">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h3 className="font-bold text-slate-800 text-lg mb-1">{selectedRole.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{selectedRole.description}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Estado</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${selectedRole.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                    {selectedRole.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Persona Asignada</span>
                  <span className="text-sm font-medium text-slate-800">{selectedRole.userId || 'Vacante'}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2 border-b border-slate-200 pb-2">Matriz RACI - Responsabilidades</h4>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedRole.responsibilities || 'No se han documentado responsabilidades específicas.'}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2 border-b border-slate-200 pb-2">Autoridades (Toma de Decisión)</h4>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedRole.authority || 'No se ha documentado autoridad específica.'}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2 border-b border-slate-200 pb-2 flex items-center">
                <Link2 className="w-4 h-4 mr-2 text-slate-400" />
                Procesos Vinculados
              </h4>
              <div className="space-y-2">
                {selectedRole.processIds && selectedRole.processIds.length > 0 ? (
                  selectedRole.processIds.map(pid => {
                    const process = data.processes?.find(p => p.id === pid);
                    return (
                      <div key={pid} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{process?.code || pid}</span>
                          <p className="text-sm font-medium text-slate-800 mt-1">{process?.name || 'Proceso Desconocido'}</p>
                        </div>
                        <button className="text-xs font-semibold text-teal-600">Ver Proceso</button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-500 italic">No hay procesos vinculados a este rol.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </SlideOver>

      <SlideOver
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Crear Nuevo Rol"
        description="Define las responsabilidades, autoridades y asigna a un usuario."
      >
        <GovernanceRoleForm
          onSuccess={() => setIsCreateOpen(false)}
          onCancel={() => setIsCreateOpen(false)}
        />
      </SlideOver>
    </div>
  );
}
