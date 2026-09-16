import React, { useState } from 'react';
import { DashboardData, Stakeholder } from '../../types';
import { Plus, Search, Filter } from 'lucide-react';
import { SlideOver } from '../ui/SlideOver';
import { StakeholderForm } from '../forms/StakeholderForm';

export function StakeholdersTab({ data, standard = 'Integrado' }: { data: DashboardData, standard?: string }) {
  let stakeholders = data.stakeholders || [];
  if (standard !== 'Integrado') {
    stakeholders = stakeholders.filter(s => s.standardIds?.includes(standard));
  }
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filtered = stakeholders.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.category && s.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
      <div className="flex justify-between items-center p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">Partes Interesadas</h2>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar stakeholder..." 
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
            AGREGAR PARTE INTERESADA
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-slate-500 mb-4">No existen partes interesadas registradas.</p>
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg"
            >
              AGREGAR PARTE INTERESADA
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(s => (
              <div key={s.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 hover:border-teal-300 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${s.internalExternal === 'Internal' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {s.internalExternal === 'Internal' ? 'Interno' : 'Externo'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-700 uppercase">
                    {s.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800">{s.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{s.category}</p>
                <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
                  <button 
                    className="text-xs font-semibold text-teal-600 hover:text-teal-800"
                    onClick={() => setSelectedStakeholder(s)}
                  >
                    VER DETALLES
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SlideOver
        isOpen={!!selectedStakeholder}
        onClose={() => setSelectedStakeholder(null)}
        title={selectedStakeholder?.name || 'Parte Interesada'}
        description={selectedStakeholder?.category || ''}
      >
        {selectedStakeholder && (
          <div className="mt-4 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2 border-b border-slate-200 pb-2">Información General</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-medium text-slate-500 mb-1">Tipo</span>
                  <span className="block text-sm text-slate-800">{selectedStakeholder.internalExternal === 'Internal' ? 'Interno' : 'Externo'}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-500 mb-1">Estado</span>
                  <span className="block text-sm text-slate-800">{selectedStakeholder.status}</span>
                </div>
                {selectedStakeholder.description && (
                  <div className="col-span-2">
                    <span className="block text-xs font-medium text-slate-500 mb-1">Descripción</span>
                    <span className="block text-sm text-slate-800">{selectedStakeholder.description}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2 border-b border-slate-200 pb-2">Necesidades y Expectativas</h4>
              <div className="space-y-3">
                {selectedStakeholder.needs && (
                  <div>
                    <span className="block text-xs font-medium text-slate-500 mb-1">Necesidades</span>
                    <p className="text-sm text-slate-800">{selectedStakeholder.needs}</p>
                  </div>
                )}
                {selectedStakeholder.expectations && (
                  <div>
                    <span className="block text-xs font-medium text-slate-500 mb-1">Expectativas</span>
                    <p className="text-sm text-slate-800">{selectedStakeholder.expectations}</p>
                  </div>
                )}
                {!selectedStakeholder.needs && !selectedStakeholder.expectations && (
                  <p className="text-sm text-slate-500 italic">No hay necesidades o expectativas registradas.</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2 border-b border-slate-200 pb-2">Requisitos</h4>
              <div className="space-y-3">
                {selectedStakeholder.requirements && (
                  <div>
                    <span className="block text-xs font-medium text-slate-500 mb-1">Requisitos Generales</span>
                    <p className="text-sm text-slate-800">{selectedStakeholder.requirements}</p>
                  </div>
                )}
                {selectedStakeholder.legalRequirements && (
                  <div>
                    <span className="block text-xs font-medium text-slate-500 mb-1">Requisitos Legales</span>
                    <p className="text-sm text-slate-800">{selectedStakeholder.legalRequirements}</p>
                  </div>
                )}
                {selectedStakeholder.contractualRequirements && (
                  <div>
                    <span className="block text-xs font-medium text-slate-500 mb-1">Requisitos Contractuales</span>
                    <p className="text-sm text-slate-800">{selectedStakeholder.contractualRequirements}</p>
                  </div>
                )}
                {!selectedStakeholder.requirements && !selectedStakeholder.legalRequirements && !selectedStakeholder.contractualRequirements && (
                  <p className="text-sm text-slate-500 italic">No hay requisitos registrados.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </SlideOver>

      <SlideOver
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Agregar Parte Interesada"
        description="Registra un nuevo grupo de interés y sus expectativas."
      >
        <StakeholderForm
          onSuccess={() => setIsCreateOpen(false)}
          onCancel={() => setIsCreateOpen(false)}
        />
      </SlideOver>
    </div>
  );
}
