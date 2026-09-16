import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { FileText, Plus, Upload, Search, FileSignature, FileKey, FileBadge } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function DocumentStudio() {
  const { currentOrgId } = useAuth();
  const [docs, setDocs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    async function fetchDocs() {
      if (!currentOrgId) return;
      setLoading(true);
      try {
        const q = query(collection(db, 'documents'), where('organizationId', '==', currentOrgId));
        const snap = await getDocs(q);
        setDocs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    fetchDocs();
  }, [currentOrgId]);

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-pulse flex flex-col items-center"><div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div><p className="mt-4 text-slate-500 font-medium">Cargando Documentos...</p></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Document Studio</h1>
          <p className="text-sm text-slate-500 mt-1">Gestión centralizada y controlada de información documentada.</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Upload className="w-4 h-4 mr-2" />
            Subir Documento
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Crear Documento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-3">
            <FileBadge className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Vigentes</p>
            <p className="text-xl font-bold text-slate-800">{docs.filter(d => d.status === 'Vigente').length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mr-3">
            <FileSignature className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">En Revisión</p>
            <p className="text-xl font-bold text-slate-800">{docs.filter(d => d.status === 'En revisión').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por código, nombre o tipo..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-800">Documento</th>
                <th className="px-6 py-4 font-semibold text-slate-800">Código</th>
                <th className="px-6 py-4 font-semibold text-slate-800">Tipo</th>
                <th className="px-6 py-4 font-semibold text-slate-800">Proceso</th>
                <th className="px-6 py-4 font-semibold text-slate-800">Estado</th>
                <th className="px-6 py-4 font-semibold text-slate-800">Actualización</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {docs.map((doc, idx) => (
                <tr key={idx} className="hover:bg-slate-50 group transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-slate-400 mr-3 group-hover:text-teal-500 transition-colors" />
                      <span className="font-medium text-slate-900 group-hover:text-teal-700 transition-colors">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{doc.code}</td>
                  <td className="px-6 py-4 text-slate-600">{doc.type}</td>
                  <td className="px-6 py-4 text-slate-600">{doc.process}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                      doc.status === 'Vigente' ? 'bg-emerald-100 text-emerald-700' :
                      doc.status === 'En revisión' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {doc.date || doc.createdAt?.split('T')[0]}
                    <span className="ml-2 px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">{doc.currentVersion}</span>
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
