import { DashboardData } from '../types';

export const initialDashboardData: DashboardData = {
  organization: {
    id: 'org-nova',
    name: 'NOVA LOGÍSTICA S.A.S.',
    sector: 'Logística y Transporte Inteligente',
    country: 'Colombia',
    city: 'Bogotá',
    employees: 450,
    leader: 'Ana Martínez',
    email: 'amartinez@novalogistica.com',
    standards: ['ISO/IEC 27001', 'ISO/IEC 42001'],
    status: 'En proceso',
    scopeDescription: 'Diseño, implementación, monitoreo y operación de modelos de inteligencia artificial y servicios de infraestructura cloud para la optimización logística, enrutamiento de flotas y atención automatizada de clientes.',
    riskMethodology: '5x5',
    riskAppetiteThreshold: 'medium',
    mandatoryAIA: true,
    humanOverrideRequired: true,
    alertEmailNotification: true,
    evidenceExpirationNoticeDays: 30,
    aiEthicsPrinciples: [
      'Transparencia y Explicabilidad Algorítmica',
      'Equidad y No Discriminación / Mitigación de Sesgo',
      'Supervisión Humana y Capacidad de Desconexión (Override)',
      'Privacidad y Gobernanza de Datos por Diseño',
      'Robustez Técnica, Seguridad y Fiabilidad'
    ],
    approvedAIProviders: ['Google Cloud Vertex AI', 'Azure OpenAI Service', 'Hugging Face Enterprise']
  },
  processes: [
    {
      id: 'p1',
      organizationId: 'org-nova',
      code: 'PRC-GER',
      name: 'Gerencia Estratégica',
      leader: 'Carlos Ruiz',
      category: 'strategic',
      status: 'active',
      criticality: 'high',
      description: 'Definición de directrices, asignación de recursos y revisión periódica del SGSI y Sistema de Gestión de IA.'
    },
    {
      id: 'p2',
      organizationId: 'org-nova',
      code: 'PRC-TI',
      name: 'Tecnología e Infraestructura Cloud',
      leader: 'Luis Gómez',
      category: 'support',
      status: 'active',
      criticality: 'critical',
      description: 'Gestión de infraestructura en la nube, ciberseguridad, pipelines MLOps y accesos.'
    },
    {
      id: 'p3',
      organizationId: 'org-nova',
      code: 'PRC-COM',
      name: 'Comercial y Cuentas Clave',
      leader: 'María Pérez',
      category: 'mission',
      status: 'active',
      criticality: 'medium',
      description: 'Gestión de contratos con clientes, acuerdos de confidencialidad y requerimientos regulatorios.'
    },
    {
      id: 'p4',
      organizationId: 'org-nova',
      code: 'PRC-OPE',
      name: 'Operaciones de Flota y Envíos',
      leader: 'Jorge Silva',
      category: 'mission',
      status: 'active',
      criticality: 'critical',
      description: 'Enrutamiento optimizado, seguimiento satelital y modelos predictivos de despacho logístico.'
    },
    {
      id: 'p5',
      organizationId: 'org-nova',
      code: 'PRC-TH',
      name: 'Talento Humano y Cultura',
      leader: 'Ana Martínez',
      category: 'support',
      status: 'active',
      criticality: 'high',
      description: 'Capacitación en seguridad y ética de IA, acuerdos de no divulgación y reclutamiento.'
    },
    {
      id: 'p6',
      organizationId: 'org-nova',
      code: 'PRC-SAC',
      name: 'Servicio al Cliente y Soporte',
      leader: 'Laura Torres',
      category: 'support',
      status: 'active',
      criticality: 'medium',
      description: 'Atención multicanal con agentes conversacionales y resolución de incidencias.'
    }
  ],
  aiSystems: [
    {
      id: 'ai1',
      organizationId: 'org-nova',
      code: 'AIS-RRHH-01',
      name: 'Asistente IA de Selección y RRHH',
      process: 'Talento Humano y Cultura',
      type: 'AI_ASSISTANT',
      ownerId: 'u-ana',
      approvalStatus: 'approved',
      riskLevel: 'medium',
      description: 'Filtro preliminar curricular y asistente de onboarding para candidatos.',
      autonomyLevel: 'ASSISTED',
      intendedUse: 'Apoyo a reclutadores sin toma de decisiones desatendida.',
      humanOverrideAvailable: true,
      firstUseDate: '2025-02-15'
    },
    {
      id: 'ai2',
      organizationId: 'org-nova',
      code: 'AIS-SAC-02',
      name: 'Agente Conversacional Omnicanal',
      process: 'Servicio al Cliente y Soporte',
      type: 'AI_AGENT',
      ownerId: 'u-laura',
      approvalStatus: 'pending_review',
      riskLevel: 'high',
      description: 'Chatbot con LLM integrado para cotización y rastreo de envíos en tiempo real.',
      autonomyLevel: 'SEMI_AUTONOMOUS',
      intendedUse: 'Atención a clientes externos vía WhatsApp y Web.',
      humanOverrideAvailable: true,
      firstUseDate: '2025-06-01'
    },
    {
      id: 'ai3',
      organizationId: 'org-nova',
      code: 'AIS-DEV-03',
      name: 'Copilot de Ingeniería y DevOps',
      process: 'Tecnología e Infraestructura Cloud',
      type: 'AI_ASSISTANT',
      ownerId: 'u-luis',
      approvalStatus: 'approved',
      riskLevel: 'low',
      description: 'Herramienta de asistencia para generación y revisión de código seguro.',
      autonomyLevel: 'ASSISTED',
      intendedUse: 'Uso interno para aceleración de desarrollo.',
      humanOverrideAvailable: true,
      firstUseDate: '2024-11-10'
    },
    {
      id: 'ai4',
      organizationId: 'org-nova',
      code: 'AIS-LOG-04',
      name: 'Modelo Predictivo de Riesgo de Entrega',
      process: 'Operaciones de Flota y Envíos',
      type: 'AI_MODEL',
      ownerId: 'u-jorge',
      approvalStatus: 'draft',
      riskLevel: 'critical',
      description: 'Red neuronal predictiva de demoras climáticas, congestión y riesgos en ruta.',
      autonomyLevel: 'SEMI_AUTONOMOUS',
      intendedUse: 'Optimización de rutas y reasignación de flota.',
      humanOverrideAvailable: true,
      firstUseDate: '2025-08-20'
    }
  ],
  risks: [
    {
      id: 'r1',
      name: 'Fuga de datos personales a través del chatbot conversacional',
      type: 'Seguridad / IA',
      level: 'Alto',
      status: 'Abierto'
    },
    {
      id: 'r2',
      name: 'Sesgo algorítmico no detectado en el filtrado de candidatos de RRHH',
      type: 'IA / Ética',
      level: 'Medio',
      status: 'Tratado'
    },
    {
      id: 'r3',
      name: 'Interrupción no programada de los servicios cloud de enrutamiento',
      type: 'Operacional / TI',
      level: 'Crítico',
      status: 'Abierto'
    },
    {
      id: 'r4',
      name: 'Uso no autorizado de modelos LLM externos sin cifrado extremo a extremo',
      type: 'Seguridad / IA',
      level: 'Alto',
      status: 'Tratado'
    },
    {
      id: 'r5',
      name: 'Falta de trazabilidad y explicabilidad en decisiones de logística',
      type: 'Gobernanza IA',
      level: 'Medio',
      status: 'Abierto'
    }
  ],
  alerts: [
    {
      id: 'a1',
      type: 'CRÍTICO',
      message: "Riesgo residual 'Interrupción de servicios cloud' fuera del umbral de tolerancia",
      date: 'Hoy',
      read: false,
      resolved: false,
      standard: 'ISO/IEC 27001',
      category: 'Riesgo',
      clause: 'ISO/IEC 27001 Cláusula 6.1.3 & 8.2',
      description: 'El riesgo de contingencia en la nube sobrepasa el nivel de apetito organizacional fijado en medio. Se requiere tratamiento inmediato de contingencia multi-región.',
      suggestedAction: 'Aprobar plan de tratamiento CAPA e implementar redundancia geográfica activa.',
      sourceType: 'risk',
      sourceId: 'r3'
    },
    {
      id: 'a2',
      type: 'ALTO',
      message: "Sistema IA 'Agente Conversacional' requiere evaluación de impacto ético (AIA)",
      date: 'Ayer',
      read: false,
      resolved: false,
      standard: 'ISO/IEC 42001',
      category: 'Sistema IA',
      clause: 'ISO/IEC 42001 Cláusula 6.1.4 (AIA)',
      description: 'El Agente Conversacional Omnicanal interactúa con usuarios finales y procesa información sensible, requiriendo evaluación de sesgo, derechos fundamentales y seguridad.',
      suggestedAction: 'Registrar la evaluación de impacto algorítmico y validar salvaguardas de supervisión humana.',
      sourceType: 'ai_system',
      sourceId: 'ai2'
    },
    {
      id: 'a3',
      type: 'MEDIO',
      message: "Evidencia 'Política de Control de Acceso Criptográfico' vence en 7 días",
      date: 'Hace 2 días',
      read: false,
      resolved: false,
      standard: 'ISO/IEC 27001',
      category: 'Evidencia',
      clause: 'Control SoA A.8.24 Criptografía',
      description: 'El documento de política criptográfica anual cumplirá su ciclo de validez en 7 días y debe ser ratificado por la dirección técnica.',
      suggestedAction: 'Cargar la versión actualizada de la política y renovar la firma digital del responsable.',
      sourceType: 'control',
      sourceId: 'ctrl-27-8.24'
    },
    {
      id: 'a4',
      type: 'BAJO',
      message: 'Plan de capacitación en gobernanza de IA completado al 85%',
      date: 'Hace 4 días',
      read: true,
      resolved: true,
      resolvedAt: 'Hace 1 día',
      resolvedBy: 'Ana Martínez',
      standard: 'ISO/IEC 42001',
      category: 'Auditoría',
      clause: 'ISO/IEC 42001 Cláusula 7.2 Competencia',
      description: 'Se cumplió la meta mínima de entrenamiento del personal de desarrollo y operaciones en principios de IA responsable.',
      suggestedAction: 'Cerrar registro de capacitación en bóveda de evidencias.',
      sourceType: 'audit',
      sourceId: 'aud1'
    }
  ],
  requirementAssessments: [
    // ISO 27001
    { id: 'ra-27-4.1', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '4', requirementId: '4.1', status: 'implemented', priority: 'ALTA' },
    { id: 'ra-27-4.2', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '4', requirementId: '4.2', status: 'implemented', priority: 'ALTA' },
    { id: 'ra-27-4.3', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '4', requirementId: '4.3', status: 'documented', priority: 'MEDIA' },
    { id: 'ra-27-4.4', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '4', requirementId: '4.4', status: 'implemented', priority: 'ALTA' },
    { id: 'ra-27-5.1', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '5', requirementId: '5.1', status: 'implemented', priority: 'ALTA' },
    { id: 'ra-27-5.2', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '5', requirementId: '5.2', status: 'verified', priority: 'ALTA' },
    { id: 'ra-27-5.3', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '5', requirementId: '5.3', status: 'implemented', priority: 'MEDIA' },
    { id: 'ra-27-6.1.1', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '6', requirementId: '6.1.1', status: 'gap', priority: 'CRÍTICA' },
    { id: 'ra-27-6.1.2', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '6', requirementId: '6.1.2', status: 'gap', priority: 'ALTA' },
    { id: 'ra-27-6.1.3', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '6', requirementId: '6.1.3', status: 'planned', priority: 'ALTA' },
    { id: 'ra-27-6.2', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '6', requirementId: '6.2', status: 'implemented', priority: 'MEDIA' },
    { id: 'ra-27-7.1', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '7', requirementId: '7.1', status: 'implemented', priority: 'MEDIA' },
    { id: 'ra-27-7.2', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '7', requirementId: '7.2', status: 'documented', priority: 'MEDIA' },
    { id: 'ra-27-7.3', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '7', requirementId: '7.3', status: 'implemented', priority: 'MEDIA' },
    { id: 'ra-27-7.4', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '7', requirementId: '7.4', status: 'implemented', priority: 'BAJA' },
    { id: 'ra-27-7.5', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '7', requirementId: '7.5', status: 'documented', priority: 'MEDIA' },
    { id: 'ra-27-8.1', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '8', requirementId: '8.1', status: 'implemented', priority: 'ALTA' },
    { id: 'ra-27-8.2', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '8', requirementId: '8.2', status: 'gap', priority: 'ALTA' },
    { id: 'ra-27-8.3', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '8', requirementId: '8.3', status: 'planned', priority: 'ALTA' },
    { id: 'ra-27-9.1', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '9', requirementId: '9.1', status: 'implemented', priority: 'MEDIA' },
    { id: 'ra-27-9.2', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '9', requirementId: '9.2', status: 'gap', priority: 'ALTA' },
    { id: 'ra-27-9.3', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '9', requirementId: '9.3', status: 'planned', priority: 'MEDIA' },
    { id: 'ra-27-10.1', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '10', requirementId: '10.1', status: 'implemented', priority: 'MEDIA' },
    { id: 'ra-27-10.2', organizationId: 'org-nova', standard: 'ISO/IEC 27001', clause: '10', requirementId: '10.2', status: 'implemented', priority: 'ALTA' },
    
    // ISO 42001
    { id: 'ra-42-4.1', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '4', requirementId: '4.1', status: 'implemented', priority: 'ALTA' },
    { id: 'ra-42-4.2', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '4', requirementId: '4.2', status: 'implemented', priority: 'ALTA' },
    { id: 'ra-42-4.3', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '4', requirementId: '4.3', status: 'documented', priority: 'MEDIA' },
    { id: 'ra-42-4.4', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '4', requirementId: '4.4', status: 'implemented', priority: 'ALTA' },
    { id: 'ra-42-5.1', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '5', requirementId: '5.1', status: 'implemented', priority: 'ALTA' },
    { id: 'ra-42-5.2', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '5', requirementId: '5.2', status: 'verified', priority: 'ALTA' },
    { id: 'ra-42-5.3', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '5', requirementId: '5.3', status: 'documented', priority: 'MEDIA' },
    { id: 'ra-42-6.1.1', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '6', requirementId: '6.1.1', status: 'gap', priority: 'CRÍTICA' },
    { id: 'ra-42-6.1.2', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '6', requirementId: '6.1.2', status: 'gap', priority: 'ALTA' },
    { id: 'ra-42-6.1.3', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '6', requirementId: '6.1.3', status: 'planned', priority: 'ALTA' },
    { id: 'ra-42-6.1.4', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '6', requirementId: '6.1.4', status: 'gap', priority: 'CRÍTICA' },
    { id: 'ra-42-6.2', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '6', requirementId: '6.2', status: 'implemented', priority: 'MEDIA' },
    { id: 'ra-42-7.1', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '7', requirementId: '7.1', status: 'implemented', priority: 'MEDIA' },
    { id: 'ra-42-7.2', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '7', requirementId: '7.2', status: 'documented', priority: 'MEDIA' },
    { id: 'ra-42-7.3', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '7', requirementId: '7.3', status: 'implemented', priority: 'MEDIA' },
    { id: 'ra-42-7.4', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '7', requirementId: '7.4', status: 'implemented', priority: 'BAJA' },
    { id: 'ra-42-7.5', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '7', requirementId: '7.5', status: 'documented', priority: 'MEDIA' },
    { id: 'ra-42-8.1', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '8', requirementId: '8.1', status: 'implemented', priority: 'ALTA' },
    { id: 'ra-42-8.2', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '8', requirementId: '8.2', status: 'gap', priority: 'ALTA' },
    { id: 'ra-42-8.3', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '8', requirementId: '8.3', status: 'planned', priority: 'ALTA' },
    { id: 'ra-42-8.4', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '8', requirementId: '8.4', status: 'gap', priority: 'ALTA' },
    { id: 'ra-42-9.1', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '9', requirementId: '9.1', status: 'implemented', priority: 'MEDIA' },
    { id: 'ra-42-9.2', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '9', requirementId: '9.2', status: 'planned', priority: 'ALTA' },
    { id: 'ra-42-9.3', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '9', requirementId: '9.3', status: 'planned', priority: 'MEDIA' },
    { id: 'ra-42-10.1', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '10', requirementId: '10.1', status: 'implemented', priority: 'MEDIA' },
    { id: 'ra-42-10.2', organizationId: 'org-nova', standard: 'ISO/IEC 42001', clause: '10', requirementId: '10.2', status: 'implemented', priority: 'ALTA' }
  ],
  controlAssessments: [
    { id: 'ca1', control: 'A.5.1', standard: 'ISO/IEC 27001', status: 'implemented', evidenceStatus: 'valid', testResult: 'effective', process: 'Gerencia' },
    { id: 'ca2', control: 'A.5.15', standard: 'ISO/IEC 27001', status: 'implemented', evidenceStatus: 'valid', testResult: 'effective', process: 'TI' },
    { id: 'ca3', control: 'A.8.7', standard: 'ISO/IEC 27001', status: 'documented', evidenceStatus: 'expiring', testResult: 'partially_effective', process: 'TI' },
    { id: 'ca4', control: 'A.6.1', standard: 'ISO/IEC 42001', status: 'gap', evidenceStatus: 'pending_review', testResult: 'not_tested', process: 'TI' }
  ],
  healthSnapshots: [
    { id: 'hs1', date: '2025-01-15', standard: 'Integrado', scope: 'Global', implementation: 45, evidence: 38, effectiveness: 30, auditReadiness: 28, globalHealth: 35 },
    { id: 'hs2', date: '2025-03-15', standard: 'Integrado', scope: 'Global', implementation: 55, evidence: 48, effectiveness: 40, auditReadiness: 38, globalHealth: 45 },
    { id: 'hs3', date: '2025-05-15', standard: 'Integrado', scope: 'Global', implementation: 64, evidence: 56, effectiveness: 49, auditReadiness: 42, globalHealth: 58 },
    { id: 'hs4', date: '2025-07-15', standard: 'Integrado', scope: 'Global', implementation: 72, evidence: 61, effectiveness: 54, auditReadiness: 47, globalHealth: 65 }
  ],
  activityLogs: [
    { id: 'log1', user: 'Ana Martínez', action: 'Actualizó Declaración de Aplicabilidad (SoA)', entity: 'Controles Normativos', date: '2025-09-14 10:30' },
    { id: 'log2', user: 'Luis Gómez', action: 'Completó Evaluación de Impacto Ético', entity: 'AIS-RRHH-01', date: '2025-09-12 16:45' },
    { id: 'log3', user: 'Carlos Ruiz', action: 'Aprobó Política de Seguridad de la Información', entity: 'Documentos', date: '2025-09-10 09:15' },
    { id: 'log4', user: 'Jorge Silva', action: 'Creó acción correctiva para riesgo de ruta', entity: 'CAPA-004', date: '2025-09-08 14:20' }
  ],
  auditItems: [
    { id: 'aud1', type: 'finding', category: 'no_conformity', status: 'open', dueDate: '2025-10-30' },
    { id: 'aud2', type: 'finding', category: 'observation', status: 'closed', dueDate: '2025-08-15' },
    { id: 'aud3', type: 'action', category: 'opportunity', status: 'pending_effectiveness', dueDate: '2025-11-15' }
  ],
  implementationActions: [
    {
      id: 'act1',
      organizationId: 'org-nova',
      title: 'Aprobación formal del inventario de algoritmos y modelos de IA',
      description: 'Reunión de comité de gobernanza para validar niveles de autonomía y riesgo de modelos.',
      priority: 'CRÍTICA',
      ownerId: 'u-carlos',
      status: 'EN PROGRESO',
      dueDate: '2025-10-15',
      progress: 65,
      comments: 'Pendiente visto bueno de asesoría jurídica.'
    },
    {
      id: 'act2',
      organizationId: 'org-nova',
      title: 'Implementar salvaguardas contra Prompt Injection en Chatbot',
      description: 'Incorporación de firewall semántico y filtros de fuga de datos en el frontend del agente.',
      priority: 'CRÍTICA',
      ownerId: 'u-luis',
      status: 'EN PROGRESO',
      dueDate: '2025-10-05',
      progress: 40
    },
    {
      id: 'act3',
      organizationId: 'org-nova',
      title: 'Capacitación en sesgo y equidad algorítmica al equipo de Talento Humano',
      description: 'Taller obligatorio sobre directrices éticas ISO 42001 para personal que interactúa con el asistente.',
      priority: 'ALTA',
      ownerId: 'u-ana',
      status: 'PENDIENTE',
      dueDate: '2025-11-01',
      progress: 10
    },
    {
      id: 'act4',
      organizationId: 'org-nova',
      title: 'Despliegue de cifrado de reposo y rotación de llaves en Cloud Storage',
      description: 'Configuración de KMS con rotación automática de 90 días conforme al control A.8.24.',
      priority: 'ALTA',
      ownerId: 'u-luis',
      status: 'COMPLETADA',
      dueDate: '2025-08-30',
      completedDate: '2025-08-28',
      progress: 100
    },
    {
      id: 'act5',
      organizationId: 'org-nova',
      title: 'Definición de Matriz de Partes Interesadas y Requisitos de IA',
      description: 'Documentar expectativas de reguladores (SIC), clientes y colaboradores conforme a cláusula 4.2.',
      priority: 'MEDIA',
      ownerId: 'u-carlos',
      status: 'COMPLETADA',
      dueDate: '2025-07-20',
      completedDate: '2025-07-18',
      progress: 100
    }
  ],
  assessmentHistory: [
    {
      id: 'ah1',
      organizationId: 'org-nova',
      requirementId: '6.1.1',
      date: '2025-09-01',
      userId: 'u-carlos',
      userName: 'Carlos Ruiz',
      field: 'status',
      oldValue: 'not_evaluated',
      newValue: 'gap',
      comment: 'Se identificó falta de metodología formal de análisis de riesgos de IA.'
    }
  ],
  stakeholders: [
    {
      id: 'sh1',
      organizationId: 'org-nova',
      name: 'Superintendencia de Transporte y SIC',
      category: 'Reguladores',
      internalExternal: 'External',
      description: 'Entidades de vigilancia y control de protección de datos y transporte.',
      requirements: 'Cumplimiento Ley 1581 (Habeas Data) y reportes de continuidad operacional.',
      status: 'active'
    },
    {
      id: 'sh2',
      organizationId: 'org-nova',
      name: 'Clientes Corporativos y Retail',
      category: 'Clientes',
      internalExternal: 'External',
      description: 'Empresas que confían su logística y cadena de frío.',
      requirements: 'Confidencialidad de rutas, SLA 99.8% y trazabilidad confiable.',
      status: 'active'
    },
    {
      id: 'sh3',
      organizationId: 'org-nova',
      name: 'Equipo de Operaciones y Conductores',
      category: 'Empleados',
      internalExternal: 'Internal',
      description: 'Usuarios del sistema de asignación y enrutamiento inteligente.',
      requirements: 'Algoritmos justos, descansos dignos y soporte ante fallas de GPS.',
      status: 'active'
    }
  ],
  governanceRoles: [
    {
      id: 'gr1',
      organizationId: 'org-nova',
      name: 'Oficial de Seguridad de la Información (CISO)',
      responsibilities: 'Liderar el SGSI, gestión de incidentes y aseguramiento de controles ISO 27001.',
      status: 'active',
      userId: 'u-luis'
    },
    {
      id: 'gr2',
      organizationId: 'org-nova',
      name: 'Comité de Ética y Gobernanza de IA',
      responsibilities: 'Evaluar sistemas de alto riesgo, aprobar casos de uso y supervisar sesgos según ISO 42001.',
      status: 'active',
      userId: 'u-carlos'
    }
  ],
  objectives: [
    {
      id: 'obj1',
      organizationId: 'org-nova',
      code: 'OBJ-SEC-01',
      name: 'Cero incidentes críticos de fuga de información',
      description: 'Garantizar la protección de los datos de despacho y clientes sin vulnerabilidades explotadas.',
      target: 100,
      currentValue: 100,
      unit: '%',
      status: 'on_track'
    },
    {
      id: 'obj2',
      organizationId: 'org-nova',
      code: 'OBJ-IA-02',
      name: 'Conformidad ética y técnica en modelos de IA',
      description: 'El 100% de los modelos en producción deben tener evaluación de impacto y mitigación de sesgos.',
      target: 100,
      currentValue: 75,
      unit: '%',
      status: 'on_track'
    }
  ],
  indicators: [
    {
      id: 'ind1',
      organizationId: 'org-nova',
      code: 'IND-SEC-01',
      name: 'Porcentaje de controles ISO 27001 implementados',
      target: 85,
      currentValue: 74,
      unit: '%',
      status: 'active'
    },
    {
      id: 'ind2',
      organizationId: 'org-nova',
      code: 'IND-IA-02',
      name: 'Tiempo promedio de respuesta y precisión del chatbot',
      target: 95,
      currentValue: 92,
      unit: '%',
      status: 'active'
    }
  ],
  indicatorMeasurements: [
    { id: 'im1', indicatorId: 'ind1', organizationId: 'org-nova', date: '2025-09-01', value: 74 }
  ],
  processInputs: [],
  processOutputs: [],
  processActivities: [],
  processDependencies: [],
  processHistory: [],
  aiImpactAssessments: [
    {
      id: 'aia1',
      organizationId: 'org-nova',
      aiSystemId: 'ai1',
      assessorId: 'u-luis',
      assessmentDate: '2025-08-10',
      safeguards: 'Riesgo leve de sesgo de género en lenguaje de hojas de vida, mitigado con reglas de anonimización.'
    }
  ],
  aiDataResources: [],
  aiLifecycleEvents: [],
  aiIncidents: [],
  aiProviders: [
    {
      id: 'prov1',
      organizationId: 'org-nova',
      name: 'OpenAI API & Azure Cognitive Services',
      service: 'LLM Inference',
      type: 'Cloud API',
      riskRating: 'high',
      status: 'active'
    },
    {
      id: 'prov2',
      organizationId: 'org-nova',
      name: 'Google Cloud Vertex AI',
      service: 'MLOps Pipeline',
      type: 'Cloud Platform',
      riskRating: 'critical',
      status: 'active'
    }
  ],
  aiHistory: [],
  nonConformities: [
    {
      id: 'nc1',
      organizationId: 'org-nova',
      title: 'Ausencia de política de uso aceptable de IA generativa pública',
      description: 'Colaboradores utilizaban herramientas externas gratuitas para redacción sin validación de privacidad.',
      source: 'Auditoría',
      identifiedDate: '2025-08-15',
      reportedBy: 'Auditor Interno',
      status: 'Plan de Acción',
      severity: 'Alta'
    }
  ],
  capas: [
    {
      id: 'capa1',
      organizationId: 'org-nova',
      nonConformityId: 'nc1',
      title: 'Publicación de Política Corporativa de IA y bloqueo perimetral de dominios no autorizados',
      description: 'Difusión de directriz obligatoria y configuración de DNS filtering para IA no aprobada.',
      type: 'Correctiva',
      ownerId: 'u-luis',
      dueDate: '2025-10-30',
      status: 'En Progreso'
    }
  ],
  normativeControls: [
    // ISO 27001
    {
      id: 'ctrl-27-a5.1',
      organizationId: 'org-nova',
      standard: 'ISO/IEC 27001',
      domain: 'Organizacional',
      code: 'A.5.1',
      name: 'Políticas de seguridad de la información',
      description: 'Se deben definir, aprobar, publicar y comunicar políticas específicas.',
      applicable: true,
      implementationStatus: 'Implementado',
      maturityLevel: 4,
      ownerId: 'u-carlos'
    },
    {
      id: 'ctrl-27-a5.15',
      organizationId: 'org-nova',
      standard: 'ISO/IEC 27001',
      domain: 'Organizacional',
      code: 'A.5.15',
      name: 'Control de acceso',
      description: 'Reglas para el control de acceso físico y lógico.',
      applicable: true,
      implementationStatus: 'Implementado',
      maturityLevel: 4,
      ownerId: 'u-luis'
    },
    {
      id: 'ctrl-27-a8.7',
      organizationId: 'org-nova',
      standard: 'ISO/IEC 27001',
      domain: 'Tecnológico',
      code: 'A.8.7',
      name: 'Protección contra malware',
      description: 'Detección y prevención de software malicioso en todos los activos.',
      applicable: true,
      implementationStatus: 'Implementado',
      maturityLevel: 3,
      ownerId: 'u-luis'
    },
    {
      id: 'ctrl-27-a8.20',
      organizationId: 'org-nova',
      standard: 'ISO/IEC 27001',
      domain: 'Tecnológico',
      code: 'A.8.20',
      name: 'Seguridad de redes',
      description: 'Segmentación de VPCs y protección contra intrusiones.',
      applicable: true,
      implementationStatus: 'En Proceso',
      maturityLevel: 2,
      ownerId: 'u-luis'
    },
    {
      id: 'ctrl-27-a8.24',
      organizationId: 'org-nova',
      standard: 'ISO/IEC 27001',
      domain: 'Tecnológico',
      code: 'A.8.24',
      name: 'Uso de criptografía',
      description: 'Gestión de llaves de cifrado en reposo y tránsito.',
      applicable: true,
      implementationStatus: 'Implementado',
      maturityLevel: 4,
      ownerId: 'u-luis'
    },
    // ISO 42001
    {
      id: 'ctrl-42-a6.1',
      organizationId: 'org-nova',
      standard: 'ISO/IEC 42001',
      domain: 'Gobernanza de Datos',
      code: 'A.6.1',
      name: 'Gobernanza de datos e información para IA',
      description: 'Procedimientos para procedencia, calidad y limpieza de datos en modelos.',
      applicable: true,
      implementationStatus: 'En Proceso',
      maturityLevel: 2,
      ownerId: 'u-luis'
    },
    {
      id: 'ctrl-42-a6.2',
      organizationId: 'org-nova',
      standard: 'ISO/IEC 42001',
      domain: 'Gobernanza de Datos',
      code: 'A.6.2',
      name: 'Adquisición y preprocesamiento de datos',
      description: 'Validación de consentimientos y minimización de sesgos en datasets.',
      applicable: true,
      implementationStatus: 'En Proceso',
      maturityLevel: 2,
      ownerId: 'u-ana'
    },
    {
      id: 'ctrl-42-a7.1',
      organizationId: 'org-nova',
      standard: 'ISO/IEC 42001',
      domain: 'Ciclo de Vida IA',
      code: 'A.7.1',
      name: 'Diseño y desarrollo responsable de sistemas IA',
      description: 'Especificación de requisitos éticos, explicabilidad y robustez.',
      applicable: true,
      implementationStatus: 'Implementado',
      maturityLevel: 3,
      ownerId: 'u-luis'
    },
    {
      id: 'ctrl-42-a8.1',
      organizationId: 'org-nova',
      standard: 'ISO/IEC 42001',
      domain: 'Operación y Monitoreo',
      code: 'A.8.1',
      name: 'Supervisión humana y override',
      description: 'Mecanismos de intervención humana en tiempo real para detener salidas anómalas.',
      applicable: true,
      implementationStatus: 'Implementado',
      maturityLevel: 4,
      ownerId: 'u-carlos'
    }
  ],
  auditSessions: [
    {
      id: 'as1',
      organizationId: 'org-nova',
      title: 'Auditoría Interna Integrada H2-2026',
      standard: 'Integrado (ISO 27001 + ISO 42001)',
      type: 'Interna',
      status: 'Programada',
      plannedDate: '2026-09-24',
      leadAuditor: 'Carlos Ruiz',
      scope: 'Evaluación de seguridad en la nube y ciclo de vida de los asistentes de IA.'
    },
    {
      id: 'as2',
      organizationId: 'org-nova',
      title: 'Auditoría Externa de Certificación Fase 1',
      standard: 'ISO/IEC 42001',
      type: 'Externa',
      status: 'Programada',
      plannedDate: '2026-10-15',
      leadAuditor: 'Bureau Veritas Lead Auditor',
      scope: 'Revisión de documentación, alcance del SGIA y evaluación de impacto de algoritmos.'
    }
  ],
  calendarEvents: [
    {
      id: 'evt-1',
      organizationId: 'org-nova',
      title: 'Comité Extraordinario de Ética y Gobernanza de IA',
      description: 'Revisión y aprobación de la Evaluación de Impacto de IA (AIA) del Agente Conversacional Omnicanal previa al pase a producción.',
      date: '2026-09-18',
      time: '10:00',
      durationMinutes: 90,
      category: 'Comité IA & Ética',
      standard: 'ISO/IEC 42001',
      status: 'Programado',
      responsible: 'Dra. Elena Gómez (Oficial Ética IA)',
      location: 'Sala de Juntas Principal / Google Meet',
      link: 'https://meet.google.com/gov-ai-session',
      clause: 'ISO/IEC 42001 Cláusula 5.1 & 6.1.4',
      attendees: ['Elena Gómez', 'Luis Morales', 'Ana Martínez', 'Carlos Ruiz']
    },
    {
      id: 'evt-2',
      organizationId: 'org-nova',
      title: 'Auditoría Interna Integrada: Seguridad Cloud & Ciclo IA',
      description: 'Revisión exhaustiva de controles criptográficos A.8.24 y salvaguardas de supervisión humana A.8.1.',
      date: '2026-09-24',
      endDate: '2026-09-25',
      time: '08:30',
      durationMinutes: 480,
      category: 'Auditoría',
      standard: 'Integrado',
      status: 'Programado',
      responsible: 'Carlos Ruiz (Auditor Líder)',
      location: 'Sede Central Bogotá - Auditorio B',
      clause: 'Cláusula 9.2 Auditoría Interna',
      attendees: ['Carlos Ruiz', 'Luis Morales', 'Equipo DevOps']
    },
    {
      id: 'evt-3',
      organizationId: 'org-nova',
      title: 'Vencimiento Plan CAPA-001: Mitigación de Vulnerabilidad API',
      description: 'Fecha límite para verificación de efectividad del parche en gateway de microservicios e inferencia.',
      date: '2026-09-22',
      time: '17:00',
      durationMinutes: 30,
      category: 'Vencimiento CAPA',
      standard: 'ISO/IEC 27001',
      status: 'Programado',
      responsible: 'Luis Morales (CISO)',
      clause: 'ISO/IEC 27001 Cláusula 10.1',
      attendees: ['Luis Morales', 'Ana Martínez']
    },
    {
      id: 'evt-4',
      organizationId: 'org-nova',
      title: 'Simulacro Anual de Incidente: Ataque de Inyección de Prompt & Fuga de Datos',
      description: 'Ejercicio de simulación de crisis cibernética con afectación a modelos de lenguaje e intentos de jailbreak.',
      date: '2026-09-29',
      time: '14:00',
      durationMinutes: 180,
      category: 'Simulacro Seguridad',
      standard: 'Integrado',
      status: 'Programado',
      responsible: 'Equipo Blue Team & CISO',
      location: 'Laboratorio SOC Remoto',
      clause: 'ISO 27001 A.5.24 - A.5.28 & ISO 42001 A.8.4',
      attendees: ['Luis Morales', 'Ingenieros MLOps', 'Comité de Crisis']
    },
    {
      id: 'evt-5',
      organizationId: 'org-nova',
      title: 'Revisión por la Dirección Semestral (Cláusula 9.3)',
      description: 'Presentación a la alta gerencia del estado de madurez, cumplimiento de objetivos, resultados de auditorías y apetito de riesgo.',
      date: '2026-10-06',
      time: '09:00',
      durationMinutes: 120,
      category: 'Revisión por la Dirección',
      standard: 'Integrado',
      status: 'Programado',
      responsible: 'Dirección General & Oficial de Cumplimiento',
      location: 'Sala Ejecutiva de Presidencia',
      clause: 'ISO/IEC 27001 & 42001 Cláusula 9.3',
      attendees: ['Gerencia General', 'CISO', 'Oficial Ética IA', 'Directora Operaciones']
    },
    {
      id: 'evt-6',
      organizationId: 'org-nova',
      title: 'Capacitación del Personal: Principios de IA Confiable & Detección de Sesgos',
      description: 'Taller obligatorio para desarrolladores, analistas de datos y operadores sobre directrices de la ISO/IEC 42001.',
      date: '2026-09-12',
      time: '11:00',
      durationMinutes: 120,
      category: 'Capacitación',
      standard: 'ISO/IEC 42001',
      status: 'Completado',
      responsible: 'Ana Martínez (Gestión del Talento & Cumplimiento)',
      location: 'Virtual Zoom / Portal Corporativo LMS',
      clause: 'Cláusula 7.2 Competencia',
      attendees: ['Ana Martínez', '35 Desarrolladores & Analistas']
    },
    {
      id: 'evt-7',
      organizationId: 'org-nova',
      title: 'Auditoría Externa Fase 1 - Certificación ISO/IEC 42001',
      description: 'Evaluación documental y de preparación por el organismo de certificación acreditado.',
      date: '2026-10-15',
      endDate: '2026-10-16',
      time: '08:00',
      durationMinutes: 480,
      category: 'Auditoría',
      standard: 'ISO/IEC 42001',
      status: 'Programado',
      responsible: 'Bureau Veritas & Equipo Directivo',
      location: 'Oficinas Centrales Nova Logística',
      clause: 'Certificación de Conformidad',
      attendees: ['Auditores Externos', 'CISO', 'Oficial de IA']
    }
  ]
};
