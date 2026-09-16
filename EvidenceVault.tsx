import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Plus, Upload, Filter, Search, FileBox, FileCheck2, Clock, XCircle } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function EvidenceVault() {
  const { currentOrgId } = useAuth();
  const [evidences, setEvidences] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    async function fetchEvidences() {
      if (!currentOrgId) return;
      setLoading(true);
      try {
        const q = query(collection(db, 'evidences'), where('organizationId', '==', currentOrgId));
        const snap = await getDocs(q);
        setEvidences(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    fetchEvidences();
  }, [currentOrgId]);

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-pulse flex flex-col items-center"><div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div><p className="mt-4 text-slate-500 font-medium">Cargando Evidencias...</p></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Evidence Vault</h1>
          <p className="text-sm text-slate-500 mt-1">Repositorio central seguro para las evidencias del sistema de gestión integrado.</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Upload className="w-4 h-4 mr-2" />
            Cargar Evidencia
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Vincular Existente
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
            <FileBox className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Evidencias</p>
            <p className="text-xl font-bold text-slate-800">{evidences.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-3">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Vigentes</p>
            <p className="text-xl font-bold text-slate-800">{evidences.filter(e => e.status === 'Vigente').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar evidencias..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
          <button className="inline-flex items-center px-3 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-800">Evidencia</th>
                <th className="px-6 py-4 font-semibold text-slate-800">Responsable / Proceso</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-center">Controles</th>
                <th className="px-6 py-4 font-semibold text-slate-800">Vencimiento</th>
                <th className="px-6 py-4 font-semibold text-slate-800">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {evidences.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50 group transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{ev.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[250px]">{ev.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-800">{ev.owner}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{ev.process}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                      {ev.controls}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {ev.expires}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                      ev.status === 'Vigente' ? 'bg-emerald-100 text-emerald-700' :
                      ev.status === 'Vencida' ? 'bg-rose-100 text-rose-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {ev.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
