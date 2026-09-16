import React, { useState } from 'react';
import { DashboardData } from '../../types';
import { Search, AlertTriangle, ArrowRight, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { SlideOver } from '../ui/SlideOver';
import { NonConformityForm } from '../forms/NonConformityForm';

export function FindingsTab({ data, standard }: { data: DashboardData, standard?: string }) {
  const nonConformities = data.nonConformities || [];
  
  // Filter for Non-Conformities strictly from 'Auditoría' source
  const auditFindings = nonConformities.filter(nc => 
    nc.source === 'Auditoría' && 
    (standard === 'Integrado' || nc.standardIds?.includes(standard!))
  ).sort((a, b) => new Date(b.identifiedDate).getTime() - new Date(a.identifiedDate).getTime());

  const [searchTerm, setSearchTerm] = useState('');
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  const displayFindings = auditFindings.filter(nc => 
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
            placeholder="Buscar hallazgos..."
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
          <span>Registrar Hallazgo</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {displayFindings.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-3 font-medium">Hallazgo</th>
                <th className="px-6 py-3 font-medium">Severidad</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium">Fecha</th>
                <th className="px-6 py-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayFindings.map((finding) => (
                <tr key={finding.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{finding.title}</p>
                    <p className="text-xs text-slate-500 truncate max-w-xs" title={finding.description}>{finding.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      finding.severity === 'Crítica' ? 'bg-red-100 text-red-700' :
                      finding.severity === 'Alta' ? 'bg-orange-100 text-orange-700' :
                      finding.severity === 'Media' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {finding.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      finding.status === 'Cerrada' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {finding.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {format(new Date(finding.identifiedDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <a href="/performance" className="inline-flex items-center text-teal-600 hover:text-teal-700 text-xs font-bold transition-colors">
                      Ver en CAPA <ArrowRight className="w-3 h-3 ml-1" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">No se encontraron hallazgos de auditoría</p>
            <p className="text-sm text-slate-400 mt-1">Los hallazgos negativos generados durante la evaluación aparecerán aquí y se enviarán automáticamente a CAPA.</p>
          </div>
        )}
      </div>

      <SlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        title="Registrar Nuevo Hallazgo"
        description="El hallazgo se enviará automáticamente al módulo CAPA para su tratamiento."
      >
        <NonConformityForm 
          defaultSource="Auditoría" 
          onSuccess={() => setIsSlideOverOpen(false)}
          onCancel={() => setIsSlideOverOpen(false)}
        />
      </SlideOver>
    </div>
  );
}
