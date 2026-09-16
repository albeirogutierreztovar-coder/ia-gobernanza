import React, { useEffect, useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  Search, 
  Filter, 
  CheckCheck, 
  Plus, 
  ShieldAlert, 
  ExternalLink, 
  ChevronRight, 
  ArrowUpRight,
  SlidersHorizontal,
  X,
  FileText,
  RotateCcw,
  Sparkles,
  Shield,
  Cpu
} from 'lucide-react';
import { AlertDetailsSlideOver } from '../components/ui/AlertDetailsSlideOver';
import { Alert } from '../types';
import { useNavigate } from 'react-router-dom';

type TabType = 'all' | 'unread' | 'unresolved' | 'resolved';

export function AlertCenter() {
  const { data, fetchData, loading, markAlertAsRead, markAllAlertsAsRead, resolveAlert, unresolveAlert, addAlert } = useStore();
  const { currentOrgId } = useAuth();
  const navigate = useNavigate();

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStandard, setSelectedStandard] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [markedAllFeedback, setMarkedAllFeedback] = useState(false);

  // New alert form state
  const [newAlertType, setNewAlertType] = useState<'CRÍTICO' | 'ALTO' | 'MEDIO' | 'BAJO'>('ALTO');
  const [newAlertMessage, setNewAlertMessage] = useState('');
  const [newAlertDescription, setNewAlertDescription] = useState('');
  const [newAlertStandard, setNewAlertStandard] = useState<'ISO/IEC 27001' | 'ISO/IEC 42001' | 'Integrado'>('ISO/IEC 27001');
  const [newAlertCategory, setNewAlertCategory] = useState<'Riesgo' | 'Sistema IA' | 'Control SoA' | 'Evidencia' | 'Auditoría'>('Riesgo');
  const [newAlertClause, setNewAlertClause] = useState('');

  useEffect(() => {
    if (currentOrgId) fetchData(currentOrgId);
  }, [fetchData, currentOrgId]);

  const alerts = data?.alerts || [];

  // Metrics
  const totalCount = alerts.length;
  const unreadCount = alerts.filter(a => !a.read && !a.resolved).length;
  const unresolvedCount = alerts.filter(a => !a.resolved).length;
  const criticalCount = alerts.filter(a => a.type === 'CRÍTICO' && !a.resolved).length;
  const resolvedCount = alerts.filter(a => a.resolved).length;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      // Tab filter
      if (activeTab === 'unread' && (alert.read || alert.resolved)) return false;
      if (activeTab === 'unresolved' && alert.resolved) return false;
      if (activeTab === 'resolved' && !alert.resolved) return false;

      // Severity filter
      if (selectedSeverity !== 'all' && alert.type !== selectedSeverity) return false;

      // Standard filter
      if (selectedStandard !== 'all' && alert.standard !== selectedStandard) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchMessage = alert.message.toLowerCase().includes(q);
        const matchDesc = alert.description?.toLowerCase().includes(q);
        const matchClause = alert.clause?.toLowerCase().includes(q);
        const matchCategory = alert.category?.toLowerCase().includes(q);
        return matchMessage || matchDesc || matchClause || matchCategory;
      }

      return true;
    });
  }, [alerts, activeTab, selectedSeverity, selectedStandard, searchQuery]);

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    await markAllAlertsAsRead();
    setMarkedAllFeedback(true);
    setTimeout(() => setMarkedAllFeedback(false), 2000);
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertMessage.trim()) return;

    await addAlert({
      type: newAlertType,
      message: newAlertMessage,
      description: newAlertDescription,
      standard: newAlertStandard,
      category: newAlertCategory,
      clause: newAlertClause || undefined,
      suggestedAction: 'Verificar estado del control y generar plan de tratamiento.',
      sourceType: newAlertCategory === 'Riesgo' ? 'risk' : newAlertCategory === 'Sistema IA' ? 'ai_system' : 'control'
    });

    setNewAlertMessage('');
    setNewAlertDescription('');
    setNewAlertClause('');
    setShowCreateModal(false);
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium">Cargando Centro de Alertas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="alert-center-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Alert Center</h1>
              <p className="text-sm text-slate-500">
                Centro unificado de alertas normativas, desviaciones de riesgo y avisos de IA.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nueva Alerta
          </button>
        </div>
      </div>

      {/* KPI Metrics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Alertas</span>
            <Bell className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalCount}</p>
          <span className="text-xs text-slate-500 mt-1 block">Registros del sistema</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Críticas Activas</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-600 mt-2">{criticalCount}</p>
          <span className="text-xs text-slate-500 mt-1 block">Requieren acción prioritaria</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">No Leídas</span>
            <span className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-pulse" />
          </div>
          <p className="text-2xl font-bold text-teal-700 mt-2">{unreadCount}</p>
          <span className="text-xs text-slate-500 mt-1 block">Pendientes de revisión</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Resueltas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{resolvedCount}</p>
          <span className="text-xs text-slate-500 mt-1 block">{resolutionRate}% de efectividad</span>
        </div>
      </div>

      {/* Main Alert List Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Navigation Tabs and Header Action */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center flex-wrap gap-1.5" id="alert-tabs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 border border-slate-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Todas ({totalCount})
            </button>

            <button
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'unread'
                  ? 'bg-white text-teal-900 border border-slate-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <span>No leídas</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-teal-100 text-teal-800 text-[11px] font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('unresolved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'unresolved'
                  ? 'bg-white text-slate-900 border border-slate-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Pendientes ({unresolvedCount})
            </button>

            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'resolved'
                  ? 'bg-white text-slate-900 border border-slate-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Resueltas ({resolvedCount})
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className={`text-xs font-semibold transition-colors inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                unreadCount === 0
                  ? 'text-slate-400 cursor-not-allowed'
                  : 'text-teal-700 hover:text-teal-900 hover:bg-teal-50/60'
              }`}
            >
              {markedAllFeedback ? (
                <>
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">¡Todas leídas!</span>
                </>
              ) : (
                <>
                  <CheckCheck className="w-4 h-4" />
                  <span>Marcar todas como leídas</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-3.5 border-b border-slate-100 bg-white flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar alertas por palabra o cláusula..."
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="text-xs py-1.5 px-2.5 border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="all">Severidad: Todas</option>
              <option value="CRÍTICO">Crítico</option>
              <option value="ALTO">Alto</option>
              <option value="MEDIO">Medio</option>
              <option value="BAJO">Bajo</option>
            </select>

            <select
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              className="text-xs py-1.5 px-2.5 border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="all">Norma: Todas</option>
              <option value="ISO/IEC 27001">ISO/IEC 27001 (SGSI)</option>
              <option value="ISO/IEC 42001">ISO/IEC 42001 (SGIA)</option>
            </select>
          </div>
        </div>

        {/* Alerts List */}
        <div className="divide-y divide-slate-100" id="alerts-list-group">
          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">No hay alertas para mostrar</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No se encontraron elementos que coincidan con la pestaña y filtros seleccionados.
              </p>
              {(searchQuery || selectedSeverity !== 'all' || selectedStandard !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSeverity('all');
                    setSelectedStandard('all');
                  }}
                  className="mt-3 text-xs font-semibold text-teal-600 hover:text-teal-800"
                >
                  Limpiar filtros de búsqueda
                </button>
              )}
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isUnread = !alert.read && !alert.resolved;
              const isResolved = !!alert.resolved;

              return (
                <div
                  key={alert.id}
                  className={`p-4 sm:p-5 transition-all flex items-start group ${
                    isResolved
                      ? 'bg-slate-50/50 opacity-80 hover:opacity-100'
                      : isUnread
                      ? 'bg-teal-50/15 hover:bg-teal-50/30'
                      : 'hover:bg-slate-50/70'
                  }`}
                >
                  {/* Severity Icon */}
                  <div className="mt-0.5 shrink-0 mr-4">
                    {alert.type === 'CRÍTICO' && (
                      <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                    )}
                    {alert.type === 'ALTO' && (
                      <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                    )}
                    {alert.type === 'MEDIO' && (
                      <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                        <Info className="w-5 h-5" />
                      </div>
                    )}
                    {alert.type === 'BAJO' && (
                      <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                        <Info className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Alert Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                          alert.type === 'CRÍTICO'
                            ? 'bg-rose-50 border-rose-200 text-rose-700'
                            : alert.type === 'ALTO'
                            ? 'bg-orange-50 border-orange-200 text-orange-700'
                            : alert.type === 'MEDIO'
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-blue-50 border-blue-200 text-blue-700'
                        }`}
                      >
                        {alert.type}
                      </span>

                      {alert.standard && (
                        <span className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                          {alert.standard}
                        </span>
                      )}

                      {alert.category && (
                        <span className="text-[11px] font-medium px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md border border-slate-200">
                          {alert.category}
                        </span>
                      )}

                      {isResolved && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Resuelta
                        </span>
                      )}

                      <span className="text-xs text-slate-400 font-medium ml-auto">
                        {alert.date}
                      </span>
                    </div>

                    <h4 
                      onClick={() => {
                        markAlertAsRead(alert.id);
                        setSelectedAlert(alert);
                      }}
                      className={`text-sm font-semibold cursor-pointer transition-colors ${
                        isResolved 
                          ? 'text-slate-600 line-through' 
                          : 'text-slate-900 hover:text-teal-700'
                      }`}
                    >
                      {alert.message}
                    </h4>

                    {alert.clause && (
                      <p className="text-xs text-slate-500 font-mono mt-1">
                        Ref: {alert.clause}
                      </p>
                    )}

                    {alert.description && (
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {alert.description}
                      </p>
                    )}

                    {/* Action Bar */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          markAlertAsRead(alert.id);
                          setSelectedAlert(alert);
                        }}
                        className="inline-flex items-center text-xs font-semibold text-teal-700 hover:text-teal-900 py-1"
                      >
                        Ver Detalles
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>

                      {!isResolved ? (
                        <button
                          type="button"
                          onClick={() => resolveAlert(alert.id)}
                          className="inline-flex items-center text-xs font-medium text-slate-600 hover:text-emerald-700 py-1 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-slate-400 group-hover:text-emerald-500" />
                          Resolver
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => unresolveAlert(alert.id)}
                          className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-amber-700 py-1 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1 text-amber-500" />
                          Reabrir
                        </button>
                      )}

                      {/* Deep links to affected modules */}
                      {alert.sourceType === 'risk' && (
                        <button
                          type="button"
                          onClick={() => navigate('/risks')}
                          className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 py-1 ml-auto"
                        >
                          <span>Ir a Riesgos</span>
                          <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 text-slate-400" />
                        </button>
                      )}
                      {alert.sourceType === 'ai_system' && (
                        <button
                          type="button"
                          onClick={() => navigate('/ai-registry')}
                          className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 py-1 ml-auto"
                        >
                          <span>Registro IA</span>
                          <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 text-slate-400" />
                        </button>
                      )}
                      {alert.sourceType === 'control' && (
                        <button
                          type="button"
                          onClick={() => navigate('/control-center')}
                          className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 py-1 ml-auto"
                        >
                          <span>Controles SoA</span>
                          <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 text-slate-400" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Read / Unread Status Indicator */}
                  <div className="shrink-0 ml-3 pt-1">
                    {isUnread ? (
                      <button
                        title="Marcar como leída"
                        onClick={() => markAlertAsRead(alert.id)}
                        className="p-1 rounded-full hover:bg-teal-100 transition-colors"
                      >
                        <div className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-pulse" />
                      </button>
                    ) : isResolved ? (
                      <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full opacity-60" title="Resuelta" />
                    ) : (
                      <div className="w-2 h-2 bg-slate-300 rounded-full" title="Leída" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SlideOver for Full Alert Details */}
      <AlertDetailsSlideOver
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        alert={selectedAlert}
      />

      {/* Modal for Creating Manual Alert */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">Registrar Nueva Alerta</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Severidad del Aviso *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['CRÍTICO', 'ALTO', 'MEDIO', 'BAJO'] as const).map((sev) => (
                    <button
                      type="button"
                      key={sev}
                      onClick={() => setNewAlertType(sev)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        newAlertType === sev
                          ? sev === 'CRÍTICO' ? 'bg-rose-50 border-rose-300 text-rose-700' :
                            sev === 'ALTO' ? 'bg-orange-50 border-orange-300 text-orange-700' :
                            sev === 'MEDIO' ? 'bg-amber-50 border-amber-300 text-amber-700' :
                            'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título / Mensaje Principal de la Alerta *
                </label>
                <input
                  type="text"
                  required
                  value={newAlertMessage}
                  onChange={(e) => setNewAlertMessage(e.target.value)}
                  placeholder="Ej. Desviación en prueba de robustez de modelo de clasificación..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estándar Aplicable
                  </label>
                  <select
                    value={newAlertStandard}
                    onChange={(e) => setNewAlertStandard(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="ISO/IEC 27001">ISO/IEC 27001 (SGSI)</option>
                    <option value="ISO/IEC 42001">ISO/IEC 42001 (SGIA)</option>
                    <option value="Integrado">Sistema Integrado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newAlertCategory}
                    onChange={(e) => setNewAlertCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Riesgo">Riesgo</option>
                    <option value="Sistema IA">Sistema IA</option>
                    <option value="Control SoA">Control SoA</option>
                    <option value="Evidencia">Evidencia</option>
                    <option value="Auditoría">Auditoría</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cláusula o Control Relacionado (Opcional)
                </label>
                <input
                  type="text"
                  value={newAlertClause}
                  onChange={(e) => setNewAlertClause(e.target.value)}
                  placeholder="Ej. ISO/IEC 42001 Cláusula 6.1.4 (AIA) o A.8.24"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descripción y Contexto del Hallazgo
                </label>
                <textarea
                  rows={3}
                  value={newAlertDescription}
                  onChange={(e) => setNewAlertDescription(e.target.value)}
                  placeholder="Explique la causa raíz o el impacto potencial en la organización..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  Guardar Alerta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
