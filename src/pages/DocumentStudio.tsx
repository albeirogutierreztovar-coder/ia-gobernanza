import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Plus, 
  Upload, 
  Search, 
  FileSignature, 
  FileKey, 
  FileBadge, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  CheckCircle, 
  Clock, 
  X,
  FileCheck,
  FolderOpen
} from 'lucide-react';
import { GovernanceDocument } from '../types';

export function DocumentStudio() {
  const { data, addDocument, updateDocument, deleteDocument } = useStore();
  const { currentOrgId } = useAuth();

  const docs: GovernanceDocument[] = data?.documents || [];
  const processes = data?.processes || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [selectedDoc, setSelectedDoc] = useState<GovernanceDocument | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'Política' as const,
    process: processes[0]?.name || 'Gerencia Estratégica',
    standard: 'Integrado' as const,
    status: 'Vigente' as const,
    currentVersion: 'v1.0',
    date: new Date().toISOString().split('T')[0],
    description: '',
    author: 'Ana Martínez',
    approver: 'Comité de Dirección'
  });

  // KPI metrics
  const totalDocs = docs.length;
  const validDocs = docs.filter(d => d.status === 'Vigente').length;
  const inReviewDocs = docs.filter(d => d.status === 'En revisión').length;
  const draftDocs = docs.filter(d => d.status === 'Borrador').length;

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.process.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'Todos' || doc.type === typeFilter;
    const matchesStatus = statusFilter === 'Todos' || doc.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    await addDocument({
      organizationId: currentOrgId || 'org-nova',
      ...formData
    });

    setIsCreateModalOpen(false);
    setFormData({
      code: '',
      name: '',
      type: 'Política',
      process: processes[0]?.name || 'Gerencia Estratégica',
      standard: 'Integrado',
      status: 'Vigente',
      currentVersion: 'v1.0',
      date: new Date().toISOString().split('T')[0],
      description: '',
      author: 'Ana Martínez',
      approver: 'Comité de Dirección'
    });
  };

  const handleStatusChange = async (id: string, newStatus: any) => {
    await updateDocument(id, { status: newStatus });
    if (selectedDoc?.id === id) {
      setSelectedDoc({ ...selectedDoc, status: newStatus });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este documento del repositorio?')) {
      await deleteDocument(id);
      if (selectedDoc?.id === id) {
        setSelectedDoc(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Document Studio</h1>
            <span className="px-2.5 py-0.5 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full border border-teal-200">
              Cláusula 7.5 Información Documentada
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Gestión centralizada y control de versiones de políticas, manuales, procedimientos y registros del SGSI/SGIA.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Documento
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mr-3 shrink-0">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Documentos</p>
            <p className="text-xl font-bold text-slate-800">{totalDocs}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-3 shrink-0">
            <FileBadge className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Vigentes / Aprobados</p>
            <p className="text-xl font-bold text-emerald-700">{validDocs}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mr-3 shrink-0">
            <FileSignature className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">En Revisión / Firma</p>
            <p className="text-xl font-bold text-amber-700">{inReviewDocs}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Borradores</p>
            <p className="text-xl font-bold text-blue-700">{draftDocs}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código, título o proceso..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="Todos">Todos los Tipos</option>
              <option value="Política">Política</option>
              <option value="Manual">Manual</option>
              <option value="Procedimiento">Procedimiento</option>
              <option value="Matriz">Matriz</option>
              <option value="Plan">Plan</option>
              <option value="Guía">Guía</option>
              <option value="Protocolo">Protocolo</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="Todos">Todos los Estados</option>
              <option value="Vigente">Vigente</option>
              <option value="En revisión">En revisión</option>
              <option value="Borrador">Borrador</option>
              <option value="Obsoleto">Obsoleto</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100/70 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5 font-semibold text-slate-800">Código</th>
                <th className="px-6 py-3.5 font-semibold text-slate-800">Documento</th>
                <th className="px-6 py-3.5 font-semibold text-slate-800">Tipo</th>
                <th className="px-6 py-3.5 font-semibold text-slate-800">Proceso</th>
                <th className="px-6 py-3.5 font-semibold text-slate-800">Versión / Fecha</th>
                <th className="px-6 py-3.5 font-semibold text-slate-800">Estado</th>
                <th className="px-6 py-3.5 font-semibold text-slate-800 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-700">No se encontraron documentos</p>
                    <p className="text-xs text-slate-400 mt-1">Ajusta los filtros o crea un nuevo documento normativo.</p>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 group transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-teal-800">
                      {doc.code}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <FileText className="w-5 h-5 text-slate-400 mr-2.5 mt-0.5 group-hover:text-teal-600 transition-colors shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                            {doc.name}
                          </p>
                          {doc.description && (
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-sm">
                              {doc.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 text-xs font-medium">
                      {doc.process}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded text-xs font-mono font-semibold">
                          {doc.currentVersion}
                        </span>
                        <span className="text-xs text-slate-500">{doc.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doc.status === 'Vigente' ? 'bg-emerald-100 text-emerald-800' :
                        doc.status === 'En revisión' ? 'bg-amber-100 text-amber-800' :
                        doc.status === 'Borrador' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {doc.status === 'Vigente' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {doc.status === 'En revisión' && <Clock className="w-3 h-3 mr-1" />}
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Slide-over */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900">Detalles del Documento</h3>
              </div>
              <button 
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <span className="font-mono text-xs font-bold text-teal-700 uppercase bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {selectedDoc.code}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-2">{selectedDoc.name}</h2>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedDoc.status === 'Vigente' ? 'bg-emerald-100 text-emerald-800' :
                    selectedDoc.status === 'En revisión' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {selectedDoc.status}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
                    {selectedDoc.type}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-600">
                    {selectedDoc.currentVersion}
                  </span>
                </div>
              </div>

              {selectedDoc.description && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Propósito / Alcance</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedDoc.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Proceso Responsable</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedDoc.process}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Estándar Aplicable</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedDoc.standard}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Elaborado Por</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedDoc.author || 'Equipo de Seguridad'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Aprobado Por</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedDoc.approver || 'Alta Dirección'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Última Actualización</p>
                  <p className="text-slate-800 mt-0.5">{selectedDoc.date}</p>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Acciones del Ciclo de Vida</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedDoc.id, 'Vigente')}
                    className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold border border-emerald-200 text-center transition-colors cursor-pointer"
                  >
                    Aprobar Documento
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedDoc.id, 'En revisión')}
                    className="px-3 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-semibold border border-amber-200 text-center transition-colors cursor-pointer"
                  >
                    Pasar a Revisión
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedDoc.id, 'Borrador')}
                    className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold border border-blue-200 text-center transition-colors cursor-pointer"
                  >
                    Regresar a Borrador
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedDoc.id, 'Obsoleto')}
                    className="px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold border border-slate-300 text-center transition-colors cursor-pointer"
                  >
                    Marcar Obsoleto
                  </button>
                </div>
              </div>

              {/* Download simulated document */}
              <div className="pt-4 border-t border-slate-200">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const text = `DOCUMENTO CONTROLADO - NOVA LOGÍSTICA S.A.S.\nCódigo: ${selectedDoc.code}\nTítulo: ${selectedDoc.name}\nTipo: ${selectedDoc.type}\nVersión: ${selectedDoc.currentVersion}\nEstado: ${selectedDoc.status}\nFecha: ${selectedDoc.date}\nProceso: ${selectedDoc.process}\n\nDescripción:\n${selectedDoc.description || 'Sin descripción adicional.'}`;
                    const blob = new Blob([text], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedDoc.code}_${selectedDoc.name.replace(/\s+/g, '_')}.txt`;
                    a.click();
                  }}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Documento Oficial (.TXT / PDF)
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Creating Document */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900">Crear Documento Normativo</h3>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Código *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="POL-SEG-02"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Tipo de Documento
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="Política">Política</option>
                    <option value="Manual">Manual</option>
                    <option value="Procedimiento">Procedimiento</option>
                    <option value="Matriz">Matriz</option>
                    <option value="Plan">Plan</option>
                    <option value="Guía">Guía</option>
                    <option value="Protocolo">Protocolo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nombre o Título *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Ej: Política de Gestión de Modelos de IA"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Descripción y Objetivos
                </label>
                <textarea 
                  rows={2}
                  placeholder="Resumen del alcance y directrices establecidas..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Proceso
                  </label>
                  <select
                    value={formData.process}
                    onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    {processes.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Estándar
                  </label>
                  <select
                    value={formData.standard}
                    onChange={(e) => setFormData({ ...formData, standard: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="Integrado">Integrado</option>
                    <option value="ISO/IEC 27001">ISO/IEC 27001</option>
                    <option value="ISO/IEC 42001">ISO/IEC 42001</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Versión
                  </label>
                  <input 
                    type="text"
                    value={formData.currentVersion}
                    onChange={(e) => setFormData({ ...formData, currentVersion: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Fecha
                  </label>
                  <input 
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-sm cursor-pointer"
                >
                  Crear Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
