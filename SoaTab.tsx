import React, { useState } from 'react';
import { DashboardData, NormativeControl } from '../../types';
import { Search, Filter, ShieldCheck, Check, X, ShieldAlert } from 'lucide-react';
import { SlideOver } from '../ui/SlideOver';
import { ControlForm } from '../forms/ControlForm';

export function SoaTab({ data, standard }: { data: DashboardData, standard?: string }) {
  const controls = data.normativeControls || [];
  const filteredControls = controls.filter(c => standard === 'Integrado' || c.standard === standard);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  
  const [selectedControl, setSelectedControl] = useState<NormativeControl | null>(null);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  // Extract unique domains
  const domains = Array.from(new Set(filteredControls.map(c => c.domain)));

  const displayControls = filteredControls.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = domainFilter === 'All' || c.domain === domainFilter;
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar código o nombre..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none min-w-[200px]"
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
          >
            <option value="All">Todos los dominios</option>
            {domains.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {displayControls.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-3 font-medium">Control</th>
                <th className="px-6 py-3 font-medium">Descripción</th>
                <th className="px-6 py-3 font-medium text-center">Aplica</th>
                <th className="px-6 py-3 font-medium">Estado / Madurez</th>
                <th className="px-6 py-3 font-medium">Responsable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayControls.map((control) => (
                <tr 
                  key={control.id} 
                  className="hover:bg-slate-50 cursor-pointer"
                  onClick={() => {
                    setSelectedControl(control);
                    setIsSlideOverOpen(true);
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{control.code}</span>
                      <span className="font-medium text-teal-700">{control.name}</span>
                      {standard === 'Integrado' && (
                        <span className="text-[10px] font-semibold text-slate-500 mt-1 uppercase tracking-wider bg-slate-100 self-start px-1.5 py-0.5 rounded">
                          {control.standard.replace('ISO/IEC ', '')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-600 line-clamp-2 max-w-md" title={control.description}>
                      {control.description}
                    </p>
                    {!control.applicable && control.justification && (
                      <p className="text-xs text-red-600 font-medium mt-1">
                        Exclusión: {control.justification}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {control.applicable ? (
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">
                        <Check className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
                        <X className="w-4 h-4" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {control.applicable ? (
                      <div className="flex flex-col space-y-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium w-fit ${
                          control.implementationStatus === 'Implementado' ? 'bg-emerald-100 text-emerald-700' :
                          control.implementationStatus === 'En Proceso' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {control.implementationStatus}
                        </span>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map(lvl => (
                            <div 
                              key={lvl} 
                              className={`w-4 h-1.5 rounded-sm ${lvl <= control.maturityLevel ? 'bg-teal-500' : 'bg-slate-200'}`}
                              title={`Nivel ${lvl}`}
                            />
                          ))}
                          <span className="text-xs font-bold text-slate-500 ml-1">L{control.maturityLevel}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {control.applicable ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-medium uppercase">
                          {control.ownerId.charAt(0)}
                        </div>
                        <span className="text-slate-700 truncate max-w-[120px]" title={control.ownerId}>{control.ownerId}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center flex flex-col items-center">
            <ShieldAlert className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No se encontraron controles con los filtros actuales</p>
          </div>
        )}
      </div>

      <SlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        title="Evaluación de Control"
        description="Evalúa la aplicabilidad, estado y madurez de este control normativo."
      >
        {selectedControl && (
          <ControlForm 
            control={selectedControl}
            onSuccess={() => setIsSlideOverOpen(false)}
            onCancel={() => setIsSlideOverOpen(false)}
          />
        )}
      </SlideOver>
    </div>
  );
}
