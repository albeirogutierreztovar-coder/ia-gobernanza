import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Shield, 
  Cpu, 
  Bell, 
  Database, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  FileText, 
  Lock, 
  Check, 
  Plus, 
  Trash2,
  RefreshCcw
} from 'lucide-react';
import { Organization } from '../types';

type SettingsTab = 'organization' | 'risk' | 'aiEthics' | 'notifications' | 'backup';

export function Settings() {
  const { data, fetchData, updateOrganization, resetToDefaultData, importData, loading } = useStore();
  const { currentOrgId, user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<SettingsTab>('organization');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [newProviderName, setNewProviderName] = useState('');

  // Local form state cloned from organization data
  const [formData, setFormData] = useState<Partial<Organization>>({
    name: '',
    sector: '',
    country: '',
    city: '',
    employees: 100,
    leader: '',
    email: '',
    standards: ['ISO/IEC 27001', 'ISO/IEC 42001'],
    status: 'En proceso',
    scopeDescription: '',
    riskMethodology: '5x5',
    riskAppetiteThreshold: 'medium',
    mandatoryAIA: true,
    humanOverrideRequired: true,
    alertEmailNotification: true,
    evidenceExpirationNoticeDays: 30,
    aiEthicsPrinciples: [],
    approvedAIProviders: []
  });

  useEffect(() => {
    if (currentOrgId && !data) {
      fetchData(currentOrgId);
    }
  }, [currentOrgId, data, fetchData]);

  useEffect(() => {
    if (data?.organization) {
      setFormData({
        name: data.organization.name || '',
        sector: data.organization.sector || '',
        country: data.organization.country || '',
        city: data.organization.city || '',
        employees: data.organization.employees || 100,
        leader: data.organization.leader || '',
        email: data.organization.email || '',
        standards: data.organization.standards || ['ISO/IEC 27001', 'ISO/IEC 42001'],
        status: data.organization.status || 'En proceso',
        scopeDescription: data.organization.scopeDescription || 'Alcance del Sistema Integrado de Gestión de Seguridad de la Información (ISO/IEC 27001) y Gobernanza de Inteligencia Artificial (ISO/IEC 42001) para todas las operaciones analíticas y servicios digitales.',
        riskMethodology: data.organization.riskMethodology || '5x5',
        riskAppetiteThreshold: data.organization.riskAppetiteThreshold || 'medium',
        mandatoryAIA: data.organization.mandatoryAIA !== undefined ? data.organization.mandatoryAIA : true,
        humanOverrideRequired: data.organization.humanOverrideRequired !== undefined ? data.organization.humanOverrideRequired : true,
        alertEmailNotification: data.organization.alertEmailNotification !== undefined ? data.organization.alertEmailNotification : true,
        evidenceExpirationNoticeDays: data.organization.evidenceExpirationNoticeDays || 30,
        aiEthicsPrinciples: data.organization.aiEthicsPrinciples || [
          'Transparencia y Explicabilidad Algorítmica',
          'Equidad y No Discriminación / Mitigación de Sesgo',
          'Supervisión Humana y Capacidad de Desconexión (Override)',
          'Privacidad y Gobernanza de Datos por Diseño',
          'Robustez Técnica, Seguridad y Fiabilidad'
        ],
        approvedAIProviders: data.organization.approvedAIProviders || [
          'Google Cloud Vertex AI',
          'Azure OpenAI Service',
          'Hugging Face Enterprise'
        ]
      });
    }
  }, [data?.organization]);

  const handleStandardToggle = (standard: string) => {
    const currentStandards = formData.standards || [];
    let updated: string[];
    if (currentStandards.includes(standard)) {
      if (currentStandards.length === 1) return; // Prevent unselecting all
      updated = currentStandards.filter(s => s !== standard);
    } else {
      updated = [...currentStandards, standard];
    }
    setFormData(prev => ({ ...prev, standards: updated }));
  };

  const handleSave = async () => {
    try {
      setSaveStatus('saving');
      setErrorMessage('');
      await updateOrganization(formData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setSaveStatus('error');
      setErrorMessage(err.message || 'Ocurrió un error al guardar la configuración.');
    }
  };

  const handleAddProvider = () => {
    if (!newProviderName.trim()) return;
    const currentProviders = formData.approvedAIProviders || [];
    if (!currentProviders.includes(newProviderName.trim())) {
      setFormData(prev => ({
        ...prev,
        approvedAIProviders: [...currentProviders, newProviderName.trim()]
      }));
      setNewProviderName('');
    }
  };

  const handleRemoveProvider = (provider: string) => {
    setFormData(prev => ({
      ...prev,
      approvedAIProviders: (prev.approvedAIProviders || []).filter(p => p !== provider)
    }));
  };

  const handleExportJSON = () => {
    if (!data) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `AIGobernanza360_Respaldo_${formData.name?.replace(/\s+/g, '_') || 'Org'}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        await importData(parsed);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } catch (err: any) {
        alert('El archivo no tiene un formato JSON válido o compatible.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = async () => {
    await resetToDefaultData();
    setShowResetModal(false);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  return (
    <div className="space-y-6 pb-12" id="settings-container">
      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 pb-5" id="settings-header">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl border border-teal-200">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Configuración del Sistema de Gestión</h1>
              <p className="text-sm text-slate-500">
                Parámetros organizacionales, alcance normativo (ISO 27001 / ISO 42001), umbrales de riesgo y ética algorítmica.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus === 'saved' && (
            <span className="flex items-center text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Configuración guardada
            </span>
          )}

          {saveStatus === 'error' && (
            <span className="flex items-center text-sm font-medium text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
              <AlertTriangle className="w-4 h-4 mr-1.5" />
              {errorMessage || 'Error al guardar'}
            </span>
          )}

          <button
            id="btn-save-settings"
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="flex items-center px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveStatus === 'saving' ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 space-x-1 overflow-x-auto" id="settings-tabs">
        <button
          id="tab-org"
          onClick={() => setActiveTab('organization')}
          className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'organization'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Building2 className="w-4 h-4 mr-2" />
          Organización & Alcance
        </button>

        <button
          id="tab-risk"
          onClick={() => setActiveTab('risk')}
          className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'risk'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Shield className="w-4 h-4 mr-2" />
          Criterios & Apetito de Riesgo
        </button>

        <button
          id="tab-ai-ethics"
          onClick={() => setActiveTab('aiEthics')}
          className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'aiEthics'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Cpu className="w-4 h-4 mr-2" />
          Gobernanza de IA & Ética
        </button>

        <button
          id="tab-notifications"
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'notifications'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Bell className="w-4 h-4 mr-2" />
          Alertas & Notificaciones
        </button>

        <button
          id="tab-backup"
          onClick={() => setActiveTab('backup')}
          className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'backup'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Database className="w-4 h-4 mr-2" />
          Respaldos & Datos
        </button>
      </div>

      {/* Tab 1: Organization & Scope */}
      {activeTab === 'organization' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="panel-org">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" />
                Datos Generales de la Entidad
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nombre o Razón Social
                  </label>
                  <input
                    id="input-org-name"
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="Ej. NOVA LOGÍSTICA S.A.S."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Sector Económico / Industria
                  </label>
                  <input
                    id="input-org-sector"
                    type="text"
                    value={formData.sector || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="Ej. Logística y Transporte Inteligente"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    País
                  </label>
                  <input
                    id="input-org-country"
                    type="text"
                    value={formData.country || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="Ej. Colombia"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ciudad Sede Principal
                  </label>
                  <input
                    id="input-org-city"
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="Ej. Bogotá"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Número de Colaboradores
                  </label>
                  <input
                    id="input-org-employees"
                    type="number"
                    value={formData.employees || 0}
                    onChange={(e) => setFormData(prev => ({ ...prev, employees: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="Ej. 450"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Estado de Madurez del Sistema
                  </label>
                  <select
                    id="select-org-status"
                    value={formData.status || 'En proceso'}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                  >
                    <option value="En proceso">En proceso de implementación</option>
                    <option value="Implementado">Completamente Implementado</option>
                    <option value="Auditado">Auditado Internamente</option>
                    <option value="Certificado">Certificado por Organismo de Evaluación</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                Declaración Formal de Alcance (Cláusula 4.3)
              </h2>
              <p className="text-xs text-slate-500">
                Definición formal de los límites físicos, organizacionales y tecnológicos donde aplican los controles de seguridad y gobernanza de IA.
              </p>
              <textarea
                id="textarea-org-scope"
                rows={4}
                value={formData.scopeDescription || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, scopeDescription: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors leading-relaxed"
                placeholder="Describa el alcance de certificación..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-600" />
                Estándares en Alcance
              </h2>
              <p className="text-xs text-slate-500">
                Seleccione las normas internacionales activas para la medición de conformidad y auditoría integrada.
              </p>

              <div className="space-y-3">
                <label className="flex items-start p-3.5 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.standards?.includes('ISO/IEC 27001') || false}
                    onChange={() => handleStandardToggle('ISO/IEC 27001')}
                    className="mt-0.5 h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-semibold text-slate-900">ISO/IEC 27001:2022</span>
                    <span className="block text-xs text-slate-500 mt-0.5">
                      Sistema de Gestión de Seguridad de la Información (SGSI). 93 controles normativos.
                    </span>
                  </div>
                </label>

                <label className="flex items-start p-3.5 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.standards?.includes('ISO/IEC 42001') || false}
                    onChange={() => handleStandardToggle('ISO/IEC 42001')}
                    className="mt-0.5 h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-semibold text-slate-900">ISO/IEC 42001:2023</span>
                    <span className="block text-xs text-slate-500 mt-0.5">
                      Sistema de Gestión de Inteligencia Artificial (AIMS). Ciclo de vida y ética de IA.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-semibold text-slate-900">Responsable Líder</h2>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Oficial / Líder de Cumplimiento
                </label>
                <input
                  type="text"
                  value={formData.leader || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, leader: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Ej. Ana Martínez"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Correo Electrónico Oficial
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="amartinez@empresa.com"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Risk Criteria & Appetite */}
      {activeTab === 'risk' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6" id="panel-risk">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-600" />
              Metodología y Apetito de Riesgo (Cláusula 6.1.2)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Defina los parámetros para evaluar probabilidad e impacto en seguridad de la información y sistemas de inteligencia artificial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-4 border border-slate-200 rounded-xl space-y-3">
              <label className="block text-sm font-semibold text-slate-900">
                Matriz de Severidad y Cálculo de Riesgo
              </label>
              <p className="text-xs text-slate-500">
                Seleccione la granularidad para la clasificación cuantitativa de probabilidad x impacto.
              </p>
              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="riskMethodology"
                    value="3x3"
                    checked={formData.riskMethodology === '3x3'}
                    onChange={() => setFormData(prev => ({ ...prev, riskMethodology: '3x3' }))}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <span>Matriz Estándar (3x3 - Bajo, Medio, Alto)</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="riskMethodology"
                    value="5x5"
                    checked={formData.riskMethodology === '5x5'}
                    onChange={() => setFormData(prev => ({ ...prev, riskMethodology: '5x5' }))}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <span>Matriz Avanzada (5x5 - Muy Bajo a Crítico)</span>
                </label>
              </div>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl space-y-3">
              <label className="block text-sm font-semibold text-slate-900">
                Umbral Máximo de Apetito al Riesgo Residual
              </label>
              <p className="text-xs text-slate-500">
                Nivel de riesgo por encima del cual es estrictamente obligatorio aplicar un plan de tratamiento CAPA.
              </p>
              <select
                value={formData.riskAppetiteThreshold || 'medium'}
                onChange={(e) => setFormData(prev => ({ ...prev, riskAppetiteThreshold: e.target.value as any }))}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="low">Bajo (Solo riesgos residuales leves son tolerados)</option>
                <option value="medium">Medio (Riesgos residuales medios aceptables con monitoreo)</option>
                <option value="high">Alto (Mayor tolerancia con revisión periódica del comité)</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Condiciones Obligatorias de Gobernanza de Riesgo</h3>
            
            <label className="flex items-start p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={formData.mandatoryAIA !== false}
                onChange={(e) => setFormData(prev => ({ ...prev, mandatoryAIA: e.target.checked }))}
                className="mt-1 h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <div className="ml-3">
                <span className="text-sm font-semibold text-slate-900 block">
                  Exigir Evaluación de Impacto de IA (AIA) antes del pase a Producción
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Conforme a ISO/IEC 42001 Cláusula 6.1.4, ningún modelo o agente autónomo podrá pasar a producción sin un estudio formal de derechos humanos, sesgo y seguridad.
                </span>
              </div>
            </label>

            <label className="flex items-start p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={formData.humanOverrideRequired !== false}
                onChange={(e) => setFormData(prev => ({ ...prev, humanOverrideRequired: e.target.checked }))}
                className="mt-1 h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <div className="ml-3">
                <span className="text-sm font-semibold text-slate-900 block">
                  Supervisión Humana Obligatoria (Human-in-the-Loop & Override)
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Los sistemas de IA clasificados con nivel de riesgo medio o alto deben contemplar mecanismos de interrupción humana y validación de decisiones.
                </span>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Tab 3: AI Governance & Ethics */}
      {activeTab === 'aiEthics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="panel-ai-ethics">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-teal-600" />
              Principios Éticos Institucionales de IA (ISO/IEC 42001 Cláusula 5.2)
            </h2>
            <p className="text-xs text-slate-500">
              Directrices transversales verificadas en cada etapa del ciclo de vida del modelo algorítmico.
            </p>

            <div className="space-y-3">
              {(formData.aiEthicsPrinciples || []).map((principle, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <span className="font-medium">{principle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-teal-600" />
              Proveedores de IA Homologados
            </h2>
            <p className="text-xs text-slate-500">
              Lista blanca de servicios cloud y APIs de IA autorizadas según control A.10 (Gestión de proveedores).
            </p>

            <div className="space-y-2">
              {(formData.approvedAIProviders || []).map((provider, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <span className="font-medium text-slate-800">{provider}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveProvider(provider)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Eliminar proveedor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex gap-2">
              <input
                type="text"
                value={newProviderName}
                onChange={(e) => setNewProviderName(e.target.value)}
                placeholder="Nuevo proveedor (ej. AWS Bedrock)"
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={handleAddProvider}
                className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Añadir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Notifications & Alerts */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6" id="panel-notifications">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-teal-600" />
              Políticas de Notificación y Monitoreo de Conformidad
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Configure cómo y cuándo el sistema alerta sobre desviaciones de controles y revisiones programadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-4 border border-slate-200 rounded-xl space-y-3">
              <label className="block text-sm font-semibold text-slate-900">
                Antelación para Vencimiento de Evidencias
              </label>
              <p className="text-xs text-slate-500">
                Días de preaviso antes de que expire la validez de una evidencia documental o técnica.
              </p>
              <select
                value={formData.evidenceExpirationNoticeDays || 30}
                onChange={(e) => setFormData(prev => ({ ...prev, evidenceExpirationNoticeDays: parseInt(e.target.value) }))}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value={15}>15 días antes</option>
                <option value={30}>30 días antes (Recomendado ISO)</option>
                <option value={45}>45 días antes</option>
                <option value={60}>60 días antes</option>
              </select>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl space-y-3">
              <label className="block text-sm font-semibold text-slate-900">
                Notificaciones por Correo Corporativo
              </label>
              <p className="text-xs text-slate-500">
                Enviar resumen de alertas críticas y hallazgos abiertos al oficial de seguridad.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="email-notif"
                  checked={formData.alertEmailNotification !== false}
                  onChange={(e) => setFormData(prev => ({ ...prev, alertEmailNotification: e.target.checked }))}
                  className="h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <label htmlFor="email-notif" className="text-sm text-slate-700 cursor-pointer">
                  Activar notificaciones a {formData.email || 'correo configurado'}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Backup, Restore & Data */}
      {activeTab === 'backup' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6" id="panel-backup">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-600" />
              Gestión de Respaldo, Portabilidad y Restauración
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Exporte el expediente completo de su SGSI y Sistema de IA o restaure una versión anterior de forma segura.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Export Card */}
            <div className="p-5 border border-slate-200 rounded-xl space-y-3 bg-slate-50/50">
              <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm">
                <Download className="w-5 h-5" />
                Descargar Copia de Seguridad Completa (JSON)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Descarga un archivo estructurado con todos los procesos, inventario de IA, riesgos, controles SoA, acciones correctivas y registros de auditoría.
              </p>
              <button
                type="button"
                onClick={handleExportJSON}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar Expediente JSON
              </button>
            </div>

            {/* Import Card */}
            <div className="p-5 border border-slate-200 rounded-xl space-y-3 bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <Upload className="w-5 h-5 text-teal-600" />
                Restaurar Respaldo desde Archivo (JSON)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cargue un archivo previamente exportado para recuperar el estado completo del sistema en este dispositivo.
              </p>
              <label className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 hover:bg-white bg-slate-100 text-slate-800 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                Cargar Archivo JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Reset section */}
          <div className="border-t border-slate-200 pt-6 mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                Restablecer a Datos Iniciales de Demostración
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Restaura el entorno empresarial de demostración oficial (NOVA LOGÍSTICA S.A.S.) con sus registros precargados.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="px-4 py-2 border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg text-sm font-medium transition-colors self-start sm:self-auto"
            >
              Restablecer Valores de Fábrica
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Reset */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">¿Restablecer datos de demostración?</h3>
              <p className="text-sm text-slate-500">
                Esta acción volverá a cargar los registros y configuraciones predeterminadas para NOVA LOGÍSTICA S.A.S. Los cambios manuales no guardados en respaldo se sobrescribirán.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Sí, Restablecer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
