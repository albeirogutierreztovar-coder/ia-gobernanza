import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { 
  BarChart2, 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  Shield, 
  Cpu, 
  AlertTriangle, 
  Calendar, 
  Sliders, 
  Search, 
  X, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Eye,
  FileSpreadsheet,
  FileCode,
  Building2,
  Clock,
  Layers,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

type ReportType = 
  | 'management_review' 
  | 'soa' 
  | 'aia' 
  | 'risk_matrix' 
  | 'audit_capa' 
  | 'kpi_objectives';

interface ReportDefinition {
  id: ReportType;
  code: string;
  title: string;
  description: string;
  standard: 'ISO/IEC 27001' | 'ISO/IEC 42001' | 'Integrado';
  clause: string;
  frequency: 'Semestral' | 'Anual' | 'Bajo Demanda' | 'Trimestral';
  category: 'Dirección' | 'Controles' | 'Inteligencia Artificial' | 'Riesgos' | 'Auditoría' | 'Desempeño';
  lastGenerated: string;
}

const REPORT_DEFINITIONS: ReportDefinition[] = [
  {
    id: 'management_review',
    code: 'INF-DIR-2026-H2',
    title: 'Informe de Revisión por la Dirección (Cláusula 9.3)',
    description: 'Informe consolidado para la alta gerencia sobre el estado de madurez, conveniencia, adecuación y eficacia del SGSI y SGIA integrados.',
    standard: 'Integrado',
    clause: 'Cláusula 9.3 (ISO 27001 & ISO 42001)',
    frequency: 'Semestral',
    category: 'Dirección',
    lastGenerated: '2026-09-10'
  },
  {
    id: 'soa',
    code: 'SOA-INTEGRADA-V2',
    title: 'Declaración de Aplicabilidad (SoA - Statement of Applicability)',
    description: 'Inventario oficial y justificación de inclusión o exclusión de los controles de seguridad (Anexo A ISO 27001) y controles de gobernanza IA (Anexo A ISO 42001).',
    standard: 'Integrado',
    clause: 'ISO 27001 Cl. 6.1.3 & ISO 42001 Cl. 6.1.3',
    frequency: 'Bajo Demanda',
    category: 'Controles',
    lastGenerated: '2026-09-15'
  },
  {
    id: 'aia',
    code: 'AIA-REP-CONV-01',
    title: 'Informe de Evaluación de Impacto de IA (AIA - Algorithmic Impact Assessment)',
    description: 'Evaluación de riesgos éticos, equidad, minimización de sesgos, explicabilidad y salvaguardas de supervisión humana de los sistemas de IA.',
    standard: 'ISO/IEC 42001',
    clause: 'ISO/IEC 42001 Cláusula 6.1.4 & Anexo A.7/A.8',
    frequency: 'Bajo Demanda',
    category: 'Inteligencia Artificial',
    lastGenerated: '2026-09-12'
  },
  {
    id: 'risk_matrix',
    code: 'MAT-RSK-CORP-26',
    title: 'Informe Técnico del Perfil y Tratamiento de Riesgos',
    description: 'Mapa de calor de riesgos inherentes y residuales de seguridad de información y sistemas de IA con sus respectivos planes de mitigación.',
    standard: 'Integrado',
    clause: 'Cláusula 6.1.2 & 8.2',
    frequency: 'Trimestral',
    category: 'Riesgos',
    lastGenerated: '2026-09-01'
  },
  {
    id: 'audit_capa',
    code: 'AUD-INT-H2-CAPA',
    title: 'Informe de Auditoría Interna & Estado de Acciones Correctivas (CAPA)',
    description: 'Dictamen de hallazgos, conformidades, no conformidades mayores/menores y trazabilidad de eficacia de los planes de acción correctiva.',
    standard: 'Integrado',
    clause: 'Cláusula 9.2 & 10.1',
    frequency: 'Semestral',
    category: 'Auditoría',
    lastGenerated: '2026-08-28'
  },
  {
    id: 'kpi_objectives',
    code: 'PERF-OBJ-Q3-26',
    title: 'Informe de Desempeño, Eficacia de Objetivos e Indicadores (Cláusula 9.1)',
    description: 'Medición de indicadores clave de rendimiento (KPI) y de riesgo (KRI) vinculados a la política de seguridad y principios de IA confiable.',
    standard: 'Integrado',
    clause: 'Cláusula 6.2 & 9.1',
    frequency: 'Trimestral',
    category: 'Desempeño',
    lastGenerated: '2026-09-05'
  }
];

export function ReportingCenter() {
  const { data } = useStore();
  
  const [selectedStandard, setSelectedStandard] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active report for preview modal
  const [activeReportType, setActiveReportType] = useState<ReportType | null>(null);
  
  // Custom report builder state
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('Informe Ejecutivo Personalizado de Cumplimiento');
  const [customIncludeSoA, setCustomIncludeSoA] = useState(true);
  const [customIncludeRisks, setCustomIncludeRisks] = useState(true);
  const [customIncludeAI, setCustomIncludeAI] = useState(true);
  const [customIncludeCAPA, setCustomIncludeCAPA] = useState(true);
  const [customIncludeObjectives, setCustomIncludeObjectives] = useState(false);

  // History of generated reports
  const [history, setHistory] = useState([
    { id: 'hist-1', code: 'SOA-INTEGRADA-V2', name: 'Declaración de Aplicabilidad (SoA)', date: '2026-09-15 14:32', format: 'PDF / CSV', user: 'Oficial CISO' },
    { id: 'hist-2', code: 'AIA-REP-CONV-01', name: 'Evaluación Impacto IA - Agente Conversacional', date: '2026-09-12 10:15', format: 'PDF', user: 'Elena Gómez' },
    { id: 'hist-3', code: 'INF-DIR-2026-H2', name: 'Revisión por la Dirección Semestral', date: '2026-09-10 18:00', format: 'PDF', user: 'Director General' },
  ]);

  // Filtered definitions
  const filteredReports = useMemo(() => {
    return REPORT_DEFINITIONS.filter(rep => {
      if (selectedStandard !== 'all' && rep.standard !== selectedStandard && rep.standard !== 'Integrado') return false;
      if (selectedCategory !== 'all' && rep.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          rep.title.toLowerCase().includes(q) ||
          rep.code.toLowerCase().includes(q) ||
          rep.description.toLowerCase().includes(q) ||
          rep.clause.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedStandard, selectedCategory, searchQuery]);

  // Statistics
  const controls = data?.normativeControls || [];
  const totalControls = controls.length;
  const implementedControls = controls.filter(c => c.implementationStatus === 'Implementado').length;
  const inProgressControls = controls.filter(c => c.implementationStatus === 'En Proceso').length;
  const maturityAvg = totalControls > 0 
    ? (controls.reduce((acc, c) => acc + c.maturityLevel, 0) / totalControls).toFixed(1)
    : '3.2';

  const risks = data?.risks || [];
  const highRisks = risks.filter(r => r.level === 'Alto' || r.level === 'Crítico' || r.level === 'critical' || r.level === 'high').length;

  const aiSystems = data?.aiSystems || [];
  const highRiskAISystems = aiSystems.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical').length;

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // CSV Export Handler
  const handleExportCSV = (reportType: ReportType) => {
    let filename = `Reporte_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
    let rows: string[][] = [];

    if (reportType === 'soa') {
      rows.push(['Norma', 'Dominio', 'Codigo', 'Nombre del Control', 'Aplicable', 'Justificacion', 'Estado', 'Nivel Madurez', 'Responsable']);
      controls.forEach(c => {
        rows.push([
          `"${c.standard}"`,
          `"${c.domain}"`,
          `"${c.code}"`,
          `"${c.name}"`,
          c.applicable ? 'Si' : 'No',
          `"${c.justification || 'Control obligatorio del sistema'}"`,
          `"${c.implementationStatus}"`,
          c.maturityLevel.toString(),
          `"${c.ownerId}"`
        ]);
      });
    } else if (reportType === 'risk_matrix') {
      rows.push(['Codigo', 'Riesgo', 'Tipo', 'Nivel', 'Estado']);
      risks.forEach(r => {
        rows.push([
          `"${r.id}"`,
          `"${r.name}"`,
          `"${r.type}"`,
          `"${r.level}"`,
          `"${r.status || 'Identificado'}"`
        ]);
      });
    } else if (reportType === 'aia') {
      rows.push(['ID Sistema', 'Nombre Sistema IA', 'Proposito', 'Nivel de Riesgo', 'Supervision Humana', 'Explicabilidad', 'Estado']);
      aiSystems.forEach(s => {
        rows.push([
          `"${s.id}"`,
          `"${s.name}"`,
          `"${s.description || s.purpose || 'Sistema de Inteligencia Artificial'}"`,
          `"${s.riskLevel || 'medium'}"`,
          'Supervision Activa (Override)',
          'SHAP / Logs Auditables',
          `"${s.approvalStatus || s.lifecycleStage || 'Activo'}"`
        ]);
      });
    } else {
      // General executive export
      rows.push(['Metrica', 'Valor', 'Detalle']);
      rows.push(['Organizacion', `"${data?.organization.name || 'Nova Logistica'}"`, 'Empresa Titular']);
      rows.push(['Total Controles SoA', totalControls.toString(), 'ISO 27001 + ISO 42001']);
      rows.push(['Controles Implementados', implementedControls.toString(), `${((implementedControls/totalControls || 1)*100).toFixed(0)}%`]);
      rows.push(['Nivel de Madurez Promedio', maturityAvg, 'Escala 0 a 5']);
      rows.push(['Riesgos Criticos/Altos', highRisks.toString(), 'Monitoreados']);
      rows.push(['Sistemas de IA en Alcance', aiSystems.length.toString(), 'ISO 42001']);
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Add to history
    setHistory(prev => [
      {
        id: `hist-${Date.now()}`,
        code: `EXP-${reportType.toUpperCase()}`,
        name: `Exportación CSV: ${reportType}`,
        date: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }),
        format: 'CSV',
        user: 'Usuario Actual'
      },
      ...prev
    ]);
  };

  // JSON Export Handler
  const handleExportJSON = (reportType: ReportType) => {
    let payload: any = {
      organization: data?.organization,
      generatedAt: new Date().toISOString(),
      reportType,
      standards: ['ISO/IEC 27001:2022', 'ISO/IEC 42001:2023'],
      systemData: {
        controls: controls,
        risks: risks,
        aiSystems: aiSystems,
        objectives: data?.objectives,
        auditSessions: data?.auditSessions,
        capas: data?.capas
      }
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Auditoria_${reportType}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" id="reporting-center-page">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl border border-teal-100">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Centro de Reportes & Evidencia Formal</h1>
            <p className="text-sm text-slate-500">
              Generación de informes ejecutivos, Declaraciones de Aplicabilidad (SoA), evaluaciones de impacto algorítmico (AIA) y auditorías.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCustomModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Sliders className="w-4 h-4 text-teal-600" />
            Reporte a Medida
          </button>

          <button
            onClick={() => setActiveReportType('management_review')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <Eye className="w-4 h-4" />
            Informe Revisión Dirección
          </button>
        </div>
      </div>

      {/* KPI Highlights Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reportes Oficiales</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{REPORT_DEFINITIONS.length}</p>
          <span className="text-xs text-slate-500 mt-1 block">Plantillas ISO 27001 & 42001</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Controles SoA Auditables</span>
            <Shield className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-teal-700 mt-2">{totalControls}</p>
          <span className="text-xs text-slate-500 mt-1 block">{implementedControls} implementados ({totalControls > 0 ? ((implementedControls/totalControls)*100).toFixed(0) : 0}%)</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Madurez del Sistema</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-2">{maturityAvg} <span className="text-sm font-normal text-slate-400">/ 5.0</span></p>
          <span className="text-xs text-slate-500 mt-1 block">Nivel Definido / Gestionado</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Sistemas IA Mapeados</span>
            <Cpu className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-indigo-700 mt-2">{aiSystems.length}</p>
          <span className="text-xs text-slate-500 mt-1 block">{highRiskAISystems} con salvaguarda AIA</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar reporte por título o cláusula..."
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={selectedStandard}
            onChange={(e) => setSelectedStandard(e.target.value)}
            className="text-xs py-1.5 px-2.5 border border-slate-200 rounded-lg bg-white text-slate-700"
          >
            <option value="all">Norma: Todas</option>
            <option value="ISO/IEC 27001">ISO/IEC 27001</option>
            <option value="ISO/IEC 42001">ISO/IEC 42001</option>
            <option value="Integrado">Sistema Integrado</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs py-1.5 px-2.5 border border-slate-200 rounded-lg bg-white text-slate-700"
          >
            <option value="all">Categoría: Todas</option>
            <option value="Dirección">Dirección</option>
            <option value="Controles">Controles SoA</option>
            <option value="Inteligencia Artificial">Inteligencia Artificial</option>
            <option value="Riesgos">Riesgos</option>
            <option value="Auditoría">Auditoría</option>
            <option value="Desempeño">Desempeño</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.map((report) => {
          return (
            <div
              key={report.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {report.code}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    report.standard === 'ISO/IEC 42001' 
                      ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                      : report.standard === 'ISO/IEC 27001'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-teal-50 text-teal-700 border border-teal-200'
                  }`}>
                    {report.standard}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                    {report.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700">Ref: {report.clause}</span>
                  <span className="bg-slate-50 px-2 py-0.5 rounded text-slate-600">{report.frequency}</span>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400">
                  Emitido: {report.lastGenerated}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleExportCSV(report.id)}
                    title="Exportar archivo CSV"
                    className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveReportType(report.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Ver / Imprimir
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* History of generated reports table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-800">Historial de Reportes Generados y Descargados</h3>
          </div>
          <span className="text-xs text-slate-500">{history.length} emisiones registradas</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-4">Código</th>
                <th className="py-2.5 px-4">Nombre del Reporte</th>
                <th className="py-2.5 px-4">Fecha & Hora</th>
                <th className="py-2.5 px-4">Formato</th>
                <th className="py-2.5 px-4">Emitido Por</th>
                <th className="py-2.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-900">{h.code}</td>
                  <td className="py-3 px-4 font-medium">{h.name}</td>
                  <td className="py-3 px-4 text-slate-500">{h.date}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[10px]">
                      {h.format}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{h.user}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setActiveReportType('management_review')}
                      className="text-teal-600 hover:text-teal-800 font-semibold inline-flex items-center gap-1"
                    >
                      Consultar <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LIVE REPORT VIEWER MODAL / PRINTABLE REPORT CONTAINER */}
      {activeReportType && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Actions Bar (hidden when printing) */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print shrink-0">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" />
                <span className="text-sm font-bold text-slate-900">
                  Vista Previa del Informe Oficial • {data?.organization.name || 'Nova Logística S.A.S.'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportCSV(activeReportType)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors shadow-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  Descargar CSV
                </button>

                <button
                  onClick={() => handleExportJSON(activeReportType)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors shadow-xs"
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-600" />
                  JSON Auditoría
                </button>

                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir / PDF
                </button>

                <button
                  onClick={() => setActiveReportType(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE DOCUMENT BODY */}
            <div className="p-8 overflow-y-auto space-y-6" id="printable-report">
              {/* Formal Document Header */}
              <div className="border-b-2 border-slate-900 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-teal-700 font-extrabold text-lg tracking-tight">
                      <Shield className="w-6 h-6 text-teal-600" />
                      <span>{data?.organization.name || 'NOVA LOGÍSTICA S.A.S.'}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      NIT: 900.123.456-7 • Sector: {data?.organization.sector || 'Logística & Cadena de Suministro'} • Sistema Integrado ISO/IEC 27001 & ISO/IEC 42001
                    </p>
                  </div>

                  <div className="text-left sm:text-right text-xs">
                    <span className="font-mono font-bold text-slate-900 block">
                      {REPORT_DEFINITIONS.find(r => r.id === activeReportType)?.code || 'DOC-INF-01'}
                    </span>
                    <span className="text-slate-500 block">Fecha de Emisión: 16 de Septiembre de 2026</span>
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-bold rounded text-[10px] inline-block mt-1 border border-rose-200">
                      CONFIDENCIAL / USO INTERNO Y AUDITORÍA
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {REPORT_DEFINITIONS.find(r => r.id === activeReportType)?.title}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    {REPORT_DEFINITIONS.find(r => r.id === activeReportType)?.description}
                  </p>
                </div>
              </div>

              {/* SPECIFIC REPORT BODY CONTENT */}
              {activeReportType === 'soa' ? (
                /* DECLARACIÓN DE APLICABILIDAD (SoA) */
                <div className="space-y-5">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-500 block">Total Controles</span>
                      <span className="text-2xl font-bold text-slate-900">{totalControls}</span>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="text-xs text-emerald-700 block">Implementados</span>
                      <span className="text-2xl font-bold text-emerald-800">{implementedControls}</span>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="text-xs text-amber-700 block">En Proceso</span>
                      <span className="text-2xl font-bold text-amber-800">{inProgressControls}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                    Inventario de Controles Normativos y Justificación
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-200">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Código</th>
                          <th className="p-2.5">Norma</th>
                          <th className="p-2.5">Control / Dominio</th>
                          <th className="p-2.5">Aplicable</th>
                          <th className="p-2.5">Estado</th>
                          <th className="p-2.5">Madurez</th>
                          <th className="p-2.5">Responsable</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {controls.map((c) => (
                          <tr key={c.id}>
                            <td className="p-2.5 font-mono font-bold text-slate-900">{c.code}</td>
                            <td className="p-2.5 text-slate-600">{c.standard}</td>
                            <td className="p-2.5">
                              <span className="font-semibold block text-slate-800">{c.name}</span>
                              <span className="text-[11px] text-slate-500">{c.description}</span>
                            </td>
                            <td className="p-2.5 text-center">
                              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                                SÍ
                              </span>
                            </td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                c.implementationStatus === 'Implementado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {c.implementationStatus}
                              </span>
                            </td>
                            <td className="p-2.5 text-center font-bold">{c.maturityLevel}/5</td>
                            <td className="p-2.5 text-slate-600">{c.ownerId}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : activeReportType === 'aia' ? (
                /* EVALUACIÓN DE IMPACTO DE IA (AIA) */
                <div className="space-y-5">
                  <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-900 leading-relaxed">
                    <strong>Directriz ISO/IEC 42001 Cláusula 6.1.4:</strong> La organización ha identificado y documentado los casos de uso algorítmicos, evaluando impactos en derechos fundamentales, seguridad operativa, privacidad, explicabilidad y la necesidad de mecanismos de intervención humana de emergencia.
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                    Inventario de Sistemas de Inteligencia Artificial & Salvaguardas
                  </h3>

                  <div className="space-y-4">
                    {aiSystems.map((sys) => (
                      <div key={sys.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-900">{sys.name}</h4>
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Nivel de Riesgo: {sys.riskLevel?.toUpperCase() || 'MEDIO'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{sys.description || sys.purpose || 'Sistema de Inteligencia Artificial en alcance del SGIA.'}</p>
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                          <div><strong>Supervisión:</strong> Human-in-the-loop (A.8.1)</div>
                          <div><strong>Gobernanza de Datos:</strong> A.6.1 Cumplido</div>
                          <div><strong>Etapa / Estado:</strong> {sys.approvalStatus || sys.lifecycleStage || 'Operación'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeReportType === 'risk_matrix' ? (
                /* MATRIZ DE RIESGOS */
                <div className="space-y-5">
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-500 block">Total Riesgos</span>
                      <span className="text-xl font-bold text-slate-900">{risks.length}</span>
                    </div>
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                      <span className="text-xs text-rose-700 block">Críticos</span>
                      <span className="text-xl font-bold text-rose-800">{risks.filter(r => r.level === 'Crítico' || r.level === 'critical').length}</span>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="text-xs text-amber-700 block">Altos</span>
                      <span className="text-xl font-bold text-amber-800">{risks.filter(r => r.level === 'Alto' || r.level === 'high').length}</span>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="text-xs text-emerald-700 block">Tratados</span>
                      <span className="text-xl font-bold text-emerald-800">{risks.filter(r => r.status === 'Tratado' || r.status === 'Mitigado').length}</span>
                    </div>
                  </div>

                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Código</th>
                        <th className="p-2.5">Riesgo</th>
                        <th className="p-2.5">Categoría / Tipo</th>
                        <th className="p-2.5">Nivel</th>
                        <th className="p-2.5">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {risks.map((r) => (
                        <tr key={r.id}>
                          <td className="p-2.5 font-mono font-bold">{r.id}</td>
                          <td className="p-2.5 font-medium">{r.name}</td>
                          <td className="p-2.5 text-slate-600">{r.type}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.level === 'Crítico' || r.level === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {r.level}
                            </span>
                          </td>
                          <td className="p-2.5">{r.status || 'En Tratamiento'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* INFORME EJECUTIVO DE REVISIÓN POR LA DIRECCIÓN (DEFAULT) */
                <div className="space-y-6">
                  {/* Executive Summary */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 leading-relaxed">
                    <h4 className="font-bold text-slate-900 text-sm">1. Resumen Ejecutivo & Estado de Conformidad</h4>
                    <p className="text-slate-700">
                      Durante el período evaluado, <strong>Nova Logística S.A.S.</strong> ha mantenido la operación de su Sistema de Gestión Integrado en cumplimiento con los estándares <strong>ISO/IEC 27001:2022</strong> e <strong>ISO/IEC 42001:2023</strong>. Se evidencia un nivel global de madurez de <strong>{maturityAvg} / 5.0</strong>, con el 100% de los controles del Anexo A definidos y aplicables documentados en la SoA.
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 border border-slate-200 rounded-lg">
                      <span className="text-[11px] text-slate-500 block">Controles SoA</span>
                      <span className="text-xl font-bold text-slate-900">{implementedControls}/{totalControls}</span>
                    </div>
                    <div className="p-3 border border-slate-200 rounded-lg">
                      <span className="text-[11px] text-slate-500 block">Sistemas de IA</span>
                      <span className="text-xl font-bold text-purple-700">{aiSystems.length} Activos</span>
                    </div>
                    <div className="p-3 border border-slate-200 rounded-lg">
                      <span className="text-[11px] text-slate-500 block">Riesgos Críticos</span>
                      <span className="text-xl font-bold text-amber-700">{highRisks} Mitigados</span>
                    </div>
                    <div className="p-3 border border-slate-200 rounded-lg">
                      <span className="text-[11px] text-slate-500 block">Auditoría Externa</span>
                      <span className="text-xl font-bold text-emerald-700">Fase 1 OK</span>
                    </div>
                  </div>

                  {/* Next decisions */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm">2. Decisiones y Asignación de Recursos de la Dirección</h4>
                    <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                      <li>Aprobar la asignación presupuestal para la auditoría externa de certificación con Bureau Veritas para octubre de 2026.</li>
                      <li>Mantener la supervisión técnica permanente (human-in-the-loop) sobre el Agente Conversacional Omnicanal.</li>
                      <li>Completar la automatización de la recolección de evidencias para controles criptográficos A.8.24.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Signatures & Formal Approvals */}
              <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs text-slate-600">
                <div className="space-y-1">
                  <div className="border-b border-slate-400 pb-8 font-serif italic text-slate-800">
                    Luis Carlos Morales
                  </div>
                  <p className="font-bold text-slate-900">Luis Carlos Morales</p>
                  <p className="text-[11px] text-slate-500">Chief Information Security Officer (CISO)</p>
                </div>

                <div className="space-y-1">
                  <div className="border-b border-slate-400 pb-8 font-serif italic text-slate-800">
                    Dra. Elena Gómez
                  </div>
                  <p className="font-bold text-slate-900">Dra. Elena Gómez</p>
                  <p className="text-[11px] text-slate-500">Oficial de Ética y Gobernanza de IA (ISO 42001)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM REPORT BUILDER MODAL */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">Generar Reporte Personalizado</h3>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Título del Reporte
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Módulos y Secciones a Incluir en el Documento:
              </label>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={customIncludeSoA}
                    onChange={(e) => setCustomIncludeSoA(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Declaración de Aplicabilidad (SoA Controles ISO 27001 & 42001)</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={customIncludeRisks}
                    onChange={(e) => setCustomIncludeRisks(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Matriz de Riesgos Inherentes y Residuales</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={customIncludeAI}
                    onChange={(e) => setCustomIncludeAI(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Inventario y Evaluación de Impacto de IA (AIA)</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={customIncludeCAPA}
                    onChange={(e) => setCustomIncludeCAPA(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Acciones Correctivas y Preventivas (CAPA)</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={customIncludeObjectives}
                    onChange={(e) => setCustomIncludeObjectives(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Medición de Objetivos e Indicadores de Desempeño</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowCustomModal(false);
                  setActiveReportType('management_review');
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                Compilar & Visualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
