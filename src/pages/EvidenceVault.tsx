import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Plus, 
  Upload, 
  Filter, 
  Search, 
  FileBox, 
  FileCheck2, 
  Clock, 
  AlertTriangle,
  XCircle, 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  CheckCircle,
  Calendar,
  User,
  Tag,
  X
} from 'lucide-react';
import { EvidenceItem } from '../types';

export function EvidenceVault() {
  const { data, addEvidence, updateEvidence, deleteEvidence } = useStore();
  const { currentOrgId } = useAuth();
  
  const evidences: EvidenceItem[] = data?.evidences || [];
  const controls = data?.normativeControls || [];
  const processes = data?.processes || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [standardFilter, setStandardFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Form state for new evidence
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: '',
    process: processes[0]?.name || 'Gerencia Estratégica',
    standard: 'Integrado' as 'ISO/IEC 27001' | 'ISO/IEC 42001' | 'Integrado',
    controlCode: '',
    status: 'Vigente' as 'Vigente' | 'Por vencer' | 'Pendiente de revisión' | 'Vencida' | 'Rechazada',
    date: new Date().toISOString().split('T')[0],
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fileType: 'PDF',
    fileSize: '1.8 MB',
    reviewedBy: 'Comité de Seguridad & IA'
  });

  // KPIs
  const totalCount = evidences.length;
  const validCount = evidences.filter(e => e.status === 'Vigente').length;
  const expiringCount = evidences.filter(e => e.status === 'Por vencer').length;
  const pendingCount = evidences.filter(e => e.status === 'Pendiente de revisión').length;
  const expiredCount = evidences.filter(e => e.status === 'Vencida' || e.status === 'Rechazada').length;

  // Filtered list
  const filteredEvidences = evidences.filter(ev => {
    const matchesSearch = 
      ev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ev.controlCode && ev.controlCode.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStandard = standardFilter === 'Todos' || ev.standard === standardFilter;
    const matchesStatus = statusFilter === 'Todos' || ev.status === statusFilter;

    return matchesSearch && matchesStandard && matchesStatus;
  });

  const handleCreateEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.owner.trim()) return;

    await addEvidence({
      organizationId: currentOrgId || 'org-nova',
      ...formData,
      controls: 1
    });

    setIsUploadModalOpen(false);
    setFormData({
      name: '',
      description: '',
      owner: '',
      process: processes[0]?.name || 'Gerencia Estratégica',
      standard: 'Integrado',
      controlCode: '',
      status: 'Vigente',
      date: new Date().toISOString().split('T')[0],
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      fileType: 'PDF',
      fileSize: '2.1 MB',
      reviewedBy: 'Comité de Seguridad & IA'
    });
  };

  const handleStatusChange = async (id: string, newStatus: any) => {
    await updateEvidence(id, { status: newStatus });
    if (selectedEvidence && selectedEvidence.id === id) {
      setSelectedEvidence({ ...selectedEvidence, status: newStatus });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este registro de evidencia?')) {
      await deleteEvidence(id);
      if (selectedEvidence?.id === id) {
        setSelectedEvidence(null);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Vigente':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle className="w-3 h-3 mr-1" /> Válida / Vigente</span>;
      case 'Por vencer':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3 h-3 mr-1" /> Por vencer</span>;
      case 'Pendiente de revisión':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" /> Pendiente</span>;
      case 'Vencida':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800"><XCircle className="w-3 h-3 mr-1" /> Vencida</span>;
      case 'Rechazada':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" /> Rechazada</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bóveda de Evidencias</h1>
            <span className="px-2.5 py-0.5 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full border border-teal-200">ISO 27001 & 42001</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Repositorio central corporativo de registros, bitácoras, políticas firmadas y artefactos probatorios para auditoría.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm cursor-pointer"
          >
            <Upload className="w-4 h-4 mr-2" />
            Cargar Evidencia
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mr-3 shrink-0">
            <FileBox className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Evidencias</p>
            <p className="text-xl font-bold text-slate-800">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-3 shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Válidas / Vigentes</p>
            <p className="text-xl font-bold text-emerald-700">{validCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mr-3 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Por Vencer (&lt;30d)</p>
            <p className="text-xl font-bold text-amber-700">{expiringCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">En Revisión</p>
            <p className="text-xl font-bold text-blue-700">{pendingCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mr-3 shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Vencidas / Rechazadas</p>
            <p className="text-xl font-bold text-rose-700">{expiredCount}</p>
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
              placeholder="Buscar por nombre, control o responsable..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Standard Filter */}
            <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-medium text-slate-600">
              {['Todos', 'ISO/IEC 27001', 'ISO/IEC 42001', 'Integrado'].map((std) => (
                <button
                  key={std}
                  onClick={() => setStandardFilter(std)}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    standardFilter === std ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                  }`}
                >
                  {std === 'Todos' ? 'Todos' : std.replace('ISO/IEC ', '')}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="Todos">Todos los Estados</option>
              <option value="Vigente">Vigente / Válida</option>
              <option value="Por vencer">Por vencer</option>
              <option value="Pendiente de revisión">Pendiente de revisión</option>
              <option value="Vencida">Vencida</option>
              <option value="Rechazada">Rechazada</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100/70 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5 font-semibold text-slate-800">Documento / Evidencia</th>
                <th className="px-6 py-3.5 font-semibold text-slate-800">Responsable / Proceso</th>
                <th className="px-6 py-3.5 font-semibold text-slate-800">Estándar & Control</th>
                <th className="px-6 py-3.5 font-semibold text-slate-800">Vencimiento</th>
                <th className="px-6 py-3.5 font-semibold text-slate-800">Estado</th>
                <th className="px-6 py-3.5 font-semibold text-slate-800 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvidences.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <FileBox className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-700">No se encontraron evidencias</p>
                    <p className="text-xs text-slate-400 mt-1">Prueba cambiando los términos de búsqueda o los filtros aplicados.</p>
                  </td>
                </tr>
              ) : (
                filteredEvidences.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50/80 group transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="p-2 rounded-lg bg-teal-50 text-teal-600 mr-3 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                            {ev.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-sm">
                            {ev.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-mono text-slate-400 uppercase">{ev.fileType || 'PDF'}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[11px] text-slate-400">{ev.fileSize || '1.5 MB'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800 flex items-center">
                        <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {ev.owner}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{ev.process}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {ev.standard}
                      </span>
                      {ev.controlCode && (
                        <p className="text-xs font-mono text-teal-700 mt-1 font-medium">{ev.controlCode}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-800 text-sm font-medium">{ev.expires}</p>
                      <p className="text-[11px] text-slate-400">Emisión: {ev.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(ev.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedEvidence(ev)}
                          className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ev.id)}
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

      {/* Slide-over for Evidence Details */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900">Detalle de Evidencia</h3>
              </div>
              <button 
                onClick={() => setSelectedEvidence(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedEvidence.name}</h2>
                <div className="mt-2 flex items-center gap-2">
                  {getStatusBadge(selectedEvidence.status)}
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
                    {selectedEvidence.standard}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Descripción del Artefacto</p>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedEvidence.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Responsable</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedEvidence.owner}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Proceso</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedEvidence.process}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Control Asociado</p>
                  <p className="font-mono text-xs font-semibold text-teal-700 mt-0.5">{selectedEvidence.controlCode || 'No vinculado'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Revisado Por</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedEvidence.reviewedBy || 'Comité de Auditoría'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Fecha Emisión</p>
                  <p className="text-slate-800 mt-0.5">{selectedEvidence.date}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Fecha Vencimiento</p>
                  <p className="text-slate-800 mt-0.5 font-semibold">{selectedEvidence.expires}</p>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Cambiar Estado Formal</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedEvidence.id, 'Vigente')}
                    className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold border border-emerald-200 text-center transition-colors cursor-pointer"
                  >
                    Aprobar como Vigente
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedEvidence.id, 'Por vencer')}
                    className="px-3 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-semibold border border-amber-200 text-center transition-colors cursor-pointer"
                  >
                    Marcar Por Vencer
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedEvidence.id, 'Pendiente de revisión')}
                    className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold border border-blue-200 text-center transition-colors cursor-pointer"
                  >
                    Enviar a Revisión
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedEvidence.id, 'Rechazada')}
                    className="px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold border border-rose-200 text-center transition-colors cursor-pointer"
                  >
                    Rechazar
                  </button>
                </div>
              </div>

              {/* Simulated Download button */}
              <div className="pt-4 border-t border-slate-200">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const blob = new Blob([`Evidencia: ${selectedEvidence.name}\nOrganización: NOVA LOGÍSTICA S.A.S.\nEstándar: ${selectedEvidence.standard}\nResponsable: ${selectedEvidence.owner}\nVálido hasta: ${selectedEvidence.expires}`], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedEvidence.name.replace(/\s+/g, '_')}_registro.txt`;
                    a.click();
                  }}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Archivo Probatorio ({selectedEvidence.fileType || 'PDF'})
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for New Evidence */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900">Cargar Nueva Evidencia</h3>
              </div>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvidence} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nombre de la Evidencia *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Ej: Política de Seguridad Cloud v2 o Log de Sesgo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Descripción y Justificación *
                </label>
                <textarea 
                  required
                  rows={2}
                  placeholder="Detalles del contenido, origen y relevancia para el control normativo..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Responsable *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Ej: Ana Martínez"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Estándar
                  </label>
                  <select
                    value={formData.standard}
                    onChange={(e) => setFormData({ ...formData, standard: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="Integrado">Integrado (Ambas)</option>
                    <option value="ISO/IEC 27001">ISO/IEC 27001</option>
                    <option value="ISO/IEC 42001">ISO/IEC 42001</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Control Relacionado
                  </label>
                  <input 
                    type="text"
                    placeholder="Ej: A.5.1 o Cláusula 6.1.4"
                    value={formData.controlCode}
                    onChange={(e) => setFormData({ ...formData, controlCode: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Fecha de Emisión
                  </label>
                  <input 
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Fecha de Vencimiento
                  </label>
                  <input 
                    type="date"
                    value={formData.expires}
                    onChange={(e) => setFormData({ ...formData, expires: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center bg-slate-50/50">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-medium text-slate-700">Arrastra tu archivo aquí o haz clic para examinar</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Soporta PDF, XLSX, CSV, DOCX hasta 25MB</p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-sm cursor-pointer"
                >
                  Guardar Evidencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
