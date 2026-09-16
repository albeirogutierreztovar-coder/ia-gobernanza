import React, { useState } from 'react';
import { DashboardData, NonConformity, CAPA } from '../../types';
import { Plus, Search, Filter, AlertTriangle, FileText, Activity, ArrowRight, User } from 'lucide-react';
import { format } from 'date-fns';
import { SlideOver } from '../ui/SlideOver';
import { NonConformityForm } from '../forms/NonConformityForm';
import { CAPAForm } from '../forms/CAPAForm';

export function NonConformitiesTab({ data, standard }: { data: DashboardData, standard?: string }) {
  const ncs = data.nonConformities || [];
  const capas = data.capas || [];
  
  const filteredNCs = ncs.filter(nc => standard === 'Integrado' || nc.standardIds?.includes(standard!))
                         .sort((a, b) => new Date(b.identifiedDate).getTime() - new Date(a.identifiedDate).getTime());

  const [searchTerm, setSearchTerm] = useState('');
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  
  // View states
  const [selectedNC, setSelectedNC] = useState<NonConformity | null>(null);
  const [isCapaFormOpen, setIsCapaFormOpen] = useState(false);

  const displayNCs = filteredNCs.filter(nc => 
    nc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar no conformidades..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsSlideOverOpen(true)}
          className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar NC</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {displayNCs.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-3 font-medium">Título / Descripción</th>
                <th className="px-6 py-3 font-medium">Origen</th>
                <th className="px-6 py-3 font-medium">Severidad</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium">Fecha Identificación</th>
                <th className="px-6 py-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayNCs.map((nc) => (
                <tr key={nc.id} className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => setSelectedNC(nc)}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{nc.title}</p>
                    <p className="text-xs text-slate-500 truncate max-w-xs">{nc.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                      {nc.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold ${
                      nc.severity === 'Crítica' ? 'bg-red-100 text-red-700' :
                      nc.severity === 'Alta' ? 'bg-orange-100 text-orange-700' :
                      nc.severity === 'Media' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {nc.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      nc.status === 'Cerrada' ? 'bg-emerald-100 text-emerald-700' :
                      nc.status === 'Resuelta' ? 'bg-teal-100 text-teal-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {nc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                    {format(new Date(nc.identifiedDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-teal-600 hover:text-teal-800 text-xs font-semibold flex items-center">
                      VER DETALLE <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">No se encontraron no conformidades</p>
            <p className="text-sm text-slate-400 mt-1">Registra una nueva NC para comenzar el seguimiento.</p>
          </div>
        )}
      </div>

      <SlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        title="Registrar No Conformidad"
        description="Añade una nueva No Conformidad para iniciar el ciclo CAPA."
      >
        <NonConformityForm 
          defaultSource="Otro" 
          onSuccess={() => setIsSlideOverOpen(false)}
          onCancel={() => setIsSlideOverOpen(false)}
        />
      </SlideOver>

      {/* NC Details SlideOver */}
      <SlideOver
        isOpen={!!selectedNC && !isCapaFormOpen}
        onClose={() => setSelectedNC(null)}
        title="Detalle de No Conformidad"
        description="Trazabilidad y control del hallazgo."
      >
        {selectedNC && (
          <div className="mt-4 space-y-6 pb-20">
            
            {/* Cabecera del Detalle */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      selectedNC.severity === 'Crítica' ? 'bg-red-100 text-red-700' :
                      selectedNC.severity === 'Alta' ? 'bg-orange-100 text-orange-700' :
                      selectedNC.severity === 'Media' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      Severidad: {selectedNC.severity}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700">
                      Origen: {selectedNC.source}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{selectedNC.title}</h3>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  selectedNC.status === 'Cerrada' ? 'bg-emerald-100 text-emerald-700' :
                  selectedNC.status === 'Resuelta' ? 'bg-teal-100 text-teal-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {selectedNC.status}
                </span>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-slate-100 text-sm text-slate-700 mb-4 whitespace-pre-wrap">
                {selectedNC.description}
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="block text-slate-500 mb-1">Fecha Identificación</span>
                  <span className="font-medium text-slate-800 flex items-center">
                    {format(new Date(selectedNC.identifiedDate), 'PPP')}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-500 mb-1">Responsable</span>
                  <span className="font-medium text-slate-800 flex items-center">
                    <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {selectedNC.ownerId || 'No asignado'}
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones Correctivas (CAPAs) vinculadas */}
            <div>
              <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-2">
                <h4 className="text-sm font-bold text-slate-800 flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-teal-600" />
                  Planes de Acción (CAPAs)
                </h4>
                <button 
                  onClick={() => setIsCapaFormOpen(true)}
                  className="text-[10px] bg-slate-900 text-white px-2 py-1 rounded font-bold uppercase tracking-wider hover:bg-slate-800"
                >
                  + Nueva CAPA
                </button>
              </div>

              <div className="space-y-3">
                {(() => {
                  const linkedCapas = capas.filter(c => c.nonConformityId === selectedNC.id);
                  if (linkedCapas.length === 0) {
                    return (
                      <div className="text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <FileText className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-600">Sin planes de acción</p>
                        <p className="text-xs text-slate-500 mt-1">Crea una CAPA para iniciar el tratamiento de esta no conformidad.</p>
                      </div>
                    );
                  }
                  
                  return linkedCapas.map(capa => (
                    <div key={capa.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:border-teal-300 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-slate-800 text-sm">{capa.title}</h5>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          capa.status === 'Cerrada' || capa.status === 'Verificada' ? 'bg-emerald-100 text-emerald-700' :
                          capa.status === 'Planeada' ? 'bg-slate-100 text-slate-600' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {capa.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-3 line-clamp-2">{capa.description}</p>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-slate-500">Resp: <span className="text-slate-800">{capa.ownerId}</span></span>
                        <span className={`font-medium ${
                          new Date(capa.dueDate) < new Date() && capa.status !== 'Cerrada' && capa.status !== 'Verificada'
                            ? 'text-red-600'
                            : 'text-slate-500'
                        }`}>
                          Vence: {format(new Date(capa.dueDate), 'MMM d')}
                        </span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

          </div>
        )}
      </SlideOver>

      {/* Embedded CAPA Form for the NC */}
      <SlideOver
        isOpen={isCapaFormOpen}
        onClose={() => setIsCapaFormOpen(false)}
        title="Nueva Acción (CAPA)"
        description={`Vinculada a la NC: ${selectedNC?.title}`}
      >
        <CAPAForm 
          defaultNcId={selectedNC?.id}
          onSuccess={() => setIsCapaFormOpen(false)}
          onCancel={() => setIsCapaFormOpen(false)}
        />
      </SlideOver>

    </div>
  );
}
