export interface Organization {
  id: string;
  name: string;
  sector: string;
  country: string;
  city: string;
  employees: number;
  leader: string;
  email: string;
  standards: string[];
  status: string;
}

export interface Process {
  id: string;
  organizationId?: string;
  code?: string;
  name: string;
  description?: string;
  objective?: string;
  scope?: string;
  category?: 'strategic' | 'mission' | 'support' | 'control';
  status?: 'draft' | 'active' | 'under_review' | 'inactive' | 'obsolete';
  siteId?: string;
  ownerId?: string;
  backupOwnerId?: string;
  criticality?: 'low' | 'medium' | 'high' | 'critical';
  reviewFrequency?: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
  currentVersion?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  leader?: string; // keeping for backward compatibility if used
}

export interface AISystem {
  id: string;
  organizationId: string;
  code?: string;
  name: string;
  description?: string;
  type?: 'AI_SYSTEM' | 'AI_APPLICATION' | 'AI_MODEL' | 'AI_AGENT' | 'AI_ASSISTANT' | 'AI_API' | 'DATASET' | 'PROMPT' | 'MODEL_REGISTRY' | 'MLOPS_PIPELINE' | 'AI_PROVIDER' | 'OTHER_AI_COMPONENT';
  processId?: string;
  process?: string;
  ownerId?: string;
  businessOwnerId?: string;
  technicalOwnerId?: string;
  providerId?: string;
  providerName?: string;
  modelName?: string;
  modelVersion?: string;
  purpose?: string;
  intendedUse?: string;
  prohibitedUses?: string;
  users?: string;
  affectedGroups?: string;
  developmentType?: string;
  internalExternal?: 'internal' | 'external';
  deploymentEnvironment?: string;
  autonomyLevel?: 'ADVISORY' | 'ASSISTED' | 'SEMI_AUTONOMOUS' | 'AUTONOMOUS';
  humanOversightLevel?: string;
  humanOverrideAvailable?: boolean;
  personalData?: boolean;
  sensitiveData?: boolean;
  confidentialData?: boolean;
  decisionImpact?: string;
  impactLevel?: 'low' | 'medium' | 'high' | 'critical';
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  riskRating?: string;
  classification?: 'allowed' | 'restricted' | 'prohibited' | 'pending_classification';
  approvalStatus?: 'draft' | 'pending_review' | 'approved' | 'conditionally_approved' | 'rejected' | 'suspended' | 'retired';
  lifecycleStage?: 'IDEA' | 'EVALUATION' | 'DESIGN' | 'DEVELOPMENT' | 'VALIDATION' | 'APPROVAL' | 'DEPLOYMENT' | 'OPERATION' | 'MONITORING' | 'CHANGE' | 'SUSPENSION' | 'RETIREMENT' | 'DECOMMISSIONING';
  firstUseDate?: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
  criticality?: string;
  countryOfOperation?: string;
  jurisdictions?: string[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Risk {
  id: string;
  name: string;
  type: string;
  level: string;
  status: string;
}

export interface Alert {
  id: string;
  type: 'CRÍTICO' | 'ALTO' | 'MEDIO' | 'BAJO';
  message: string;
  date: string;
}

export interface RequirementAssessment {
  id: string;
  organizationId: string;
  standard: string;
  clause: string;
  requirementId: string;
  processId?: string;
  ownerId?: string;
  applicability?: boolean;
  applicabilityJustification?: string;
  status: 'not_evaluated' | 'gap' | 'planned' | 'documented' | 'implemented' | 'implemented_maintained' | 'verified' | 'not_applicable';
  implementationScore?: number;
  evidenceStatus?: string;
  effectivenessStatus?: string;
  auditStatus?: string;
  gapDescription?: string;
  currentPractice?: string;
  priority?: 'CRÍTICA' | 'ALTA' | 'MEDIA' | 'BAJA';
  targetDate?: string;
  reviewDate?: string;
  reviewedBy?: string;
  comments?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ControlAssessment {
  id: string;
  control: string;
  standard: string;
  status: 'not_evaluated' | 'gap' | 'planned' | 'documented' | 'implemented' | 'evidenced' | 'verified';
  evidenceStatus: 'valid' | 'expiring' | 'pending_review' | 'expired' | 'rejected';
  testResult: 'effective' | 'partially_effective' | 'ineffective' | 'not_tested';
  process: string;
}

export interface HealthSnapshot {
  id: string;
  date: string;
  standard: string;
  scope: string;
  implementation: number;
  evidence: number;
  effectiveness: number;
  auditReadiness: number;
  globalHealth: number;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  entity: string;
  date: string;
}

export interface AuditItem {
  id: string;
  type: 'finding' | 'action';
  category: 'no_conformity' | 'observation' | 'opportunity';
  status: 'open' | 'closed' | 'pending_effectiveness';
  dueDate: string;
}

export type NonConformityStatus = 'Abierta' | 'En Investigación' | 'Plan de Acción' | 'Resuelta' | 'Cerrada';
export interface NonConformity {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  source: 'Auditoría' | 'Incidente' | 'Revisión por la Dirección' | 'Otro';
  standardIds?: string[];
  identifiedDate: string;
  reportedBy: string;
  status: NonConformityStatus;
  severity: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  capaIds?: string[];
}

export type CAPAStatus = 'Planeada' | 'En Progreso' | 'Implementada' | 'Verificada' | 'Cerrada';
export interface CAPA {
  id: string;
  organizationId: string;
  nonConformityId?: string;
  title: string;
  description: string;
  type: 'Correctiva' | 'Preventiva' | 'Mejora';
  ownerId: string;
  dueDate: string;
  status: CAPAStatus;
  completionDate?: string;
  verificationNotes?: string;
}

export interface NormativeControl {
  id: string;
  organizationId: string;
  standard: string;
  domain: string;
  code: string;
  name: string;
  description: string;
  applicable: boolean;
  justification?: string;
  implementationStatus: 'No Implementado' | 'En Proceso' | 'Implementado';
  maturityLevel: 0 | 1 | 2 | 3 | 4 | 5;
  ownerId: string;
}

export interface AuditSession {
  id: string;
  organizationId: string;
  title: string;
  standard: string;
  type: 'Interna' | 'Externa' | 'Revisión por la Dirección';
  status: 'Programada' | 'En Progreso' | 'Completada' | 'Cancelada';
  plannedDate: string;
  leadAuditor: string;
  scope?: string;
}

export interface DashboardData {
  organization: Organization;
  processes: Process[];
  aiSystems: AISystem[];
  risks: Risk[];
  alerts: Alert[];
  requirementAssessments: RequirementAssessment[];
  controlAssessments: ControlAssessment[];
  healthSnapshots: HealthSnapshot[];
  activityLogs: ActivityLog[];
  auditItems: AuditItem[];
  implementationActions: ImplementationAction[];
  assessmentHistory: AssessmentHistory[];
  processInputs?: ProcessInput[];
  processOutputs?: ProcessOutput[];
  processActivities?: ProcessActivity[];
  stakeholders?: Stakeholder[];
  governanceRoles?: GovernanceRole[];
  objectives?: Objective[];
  indicators?: Indicator[];
  indicatorMeasurements?: IndicatorMeasurement[];
  processDependencies?: ProcessDependency[];
  processHistory?: ProcessHistory[];
  aiImpactAssessments?: AIImpactAssessment[];
  aiDataResources?: AIDataResource[];
  aiLifecycleEvents?: AILifecycleEvent[];
  aiIncidents?: AIIncident[];
  aiProviders?: AIProvider[];
  aiHistory?: AIHistory[];
  nonConformities?: NonConformity[];
  capas?: CAPA[];
  normativeControls?: NormativeControl[];
  auditSessions?: AuditSession[];
}

export interface ImplementationAction {
  id: string;
  organizationId: string;
  requirementIds?: string[];
  title: string;
  description: string;
  priority: 'CRÍTICA' | 'ALTA' | 'MEDIA' | 'BAJA';
  ownerId: string;
  status: 'PENDIENTE' | 'EN PROGRESO' | 'BLOQUEADA' | 'EN REVISIÓN' | 'COMPLETADA' | 'VENCIDA';
  startDate?: string;
  dueDate: string;
  completedDate?: string;
  progress?: number;
  comments?: string;
}


export interface AssessmentHistory {
  id: string;
  organizationId: string;
  requirementId: string;
  date: string;
  userId: string;
  userName?: string;
  field: string;
  oldValue: string;
  newValue: string;
  comment?: string;
}

export interface ProcessInput {
  id: string;
  organizationId: string;
  processId: string;
  supplierType: 'internal_process' | 'external_supplier' | 'customer' | 'regulator' | 'other';
  supplierId?: string;
  supplierName: string;
  description: string;
  requirement?: string;
  sourceProcessId?: string;
  critical: boolean;
  createdAt?: string;
}

export interface ProcessOutput {
  id: string;
  organizationId: string;
  processId: string;
  description: string;
  customerType: 'internal_process' | 'external_customer' | 'regulator' | 'other';
  customerId?: string;
  customerName: string;
  destinationProcessId?: string;
  critical: boolean;
  createdAt?: string;
}

export interface ProcessActivity {
  id: string;
  organizationId: string;
  processId: string;
  sequence: number;
  name: string;
  description?: string;
  ownerRoleId?: string;
  ownerUserId?: string;
  tool?: string;
  usesAI: boolean;
  aiSystemId?: string;
  inputDescription?: string;
  outputDescription?: string;
  frequency?: string;
  critical: boolean;
  controlIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Stakeholder {
  id: string;
  organizationId: string;
  name: string;
  type?: string;
  category: 'Alta Dirección' | 'Empleados' | 'Clientes' | 'Usuarios' | 'Proveedores' | 'Proveedores IA' | 'Socios' | 'Autoridades' | 'Reguladores' | 'Comunidad' | 'Sociedad' | 'Otros';
  internalExternal: 'Internal' | 'External';
  description?: string;
  needs?: string;
  expectations?: string;
  requirements?: string;
  legalRequirements?: string;
  contractualRequirements?: string;
  affectedProcessIds?: string[];
  standardIds?: string[];
  ownerId?: string;
  communicationMethod?: string;
  reviewFrequency?: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
  status: 'active' | 'inactive';
}

export interface GovernanceRole {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  userId?: string;
  processIds?: string[];
  responsibilities?: string;
  authority?: string;
  standardIds?: string[];
  assignmentDate?: string;
  reviewDate?: string;
  status: 'active' | 'inactive';
  evidenceId?: string;
}

export interface Objective {
  id: string;
  organizationId: string;
  processId?: string;
  standardIds?: string[];
  code: string;
  name: string;
  description?: string;
  expectedOutcome?: string;
  ownerId?: string;
  baseline?: number;
  target?: number;
  currentValue?: number;
  unit?: string;
  startDate?: string;
  dueDate?: string;
  measurementFrequency?: string;
  measurementMethod?: string;
  status: 'draft' | 'active' | 'on_track' | 'at_risk' | 'off_track' | 'completed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface Indicator {
  id: string;
  organizationId: string;
  processId?: string;
  objectiveId?: string;
  code: string;
  name: string;
  description?: string;
  formula?: string;
  unit?: string;
  target?: number;
  greenThreshold?: number;
  yellowThreshold?: number;
  redThreshold?: number;
  frequency?: string;
  ownerId?: string;
  dataSource?: string;
  currentValue?: number;
  measurementDate?: string;
  status: 'active' | 'inactive';
}

export interface IndicatorMeasurement {
  id: string;
  indicatorId: string;
  organizationId: string;
  date: string;
  value: number;
  comment?: string;
  evidenceId?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface ProcessDependency {
  id: string;
  organizationId: string;
  sourceProcessId: string;
  targetProcessId: string;
  dependencyType: 'information' | 'service' | 'technology' | 'approval' | 'supplier' | 'data' | 'people' | 'other';
  description?: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
}

export interface ProcessHistory {
  id: string;
  organizationId: string;
  entityType: 'process' | 'activity' | 'input' | 'output' | 'stakeholder' | 'objective' | 'indicator' | 'role';
  entityId: string;
  userId: string;
  userName?: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'version_change';
  date: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  comment?: string;
}

export interface AIImpactAssessment {
  id: string;
  organizationId: string;
  aiSystemId: string;
  version?: string;
  assessmentDate?: string;
  purpose?: string;
  affectedIndividuals?: string;
  affectedGroups?: string;
  privacyImpact?: string;
  fairnessImpact?: string;
  discriminationImpact?: string;
  autonomyImpact?: string;
  safetyImpact?: string;
  economicImpact?: string;
  rightsImpact?: string;
  accessibilityImpact?: string;
  socialImpact?: string;
  environmentalImpact?: string;
  probability?: number;
  severity?: number;
  inherentImpact?: number;
  safeguards?: string;
  residualProbability?: number;
  residualSeverity?: number;
  residualImpact?: number;
  assessorId?: string;
  ownerId?: string;
  approverId?: string;
  status?: string;
  approvalDecision?: string;
  nextReviewDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AIDataResource {
  id: string;
  organizationId: string;
  aiSystemId: string;
  name: string;
  type?: string;
  purpose?: string;
  source?: string;
  sourceOwner?: string;
  license?: string;
  trainingData?: boolean;
  validationData?: boolean;
  testData?: boolean;
  operationalData?: boolean;
  personalData?: boolean;
  sensitiveData?: boolean;
  location?: string;
  storageSystem?: string;
  qualityStatus?: string;
  lineageStatus?: string;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AILifecycleEvent {
  id: string;
  aiSystemId: string;
  stage: string;
  eventType?: string;
  description?: string;
  decision?: string;
  responsibleId?: string;
  date: string;
  evidenceIds?: string[];
  documentIds?: string[];
  riskIds?: string[];
  version?: string;
  createdAt?: string;
}

export interface AIIncident {
  id: string;
  organizationId: string;
  aiSystemId: string;
  category: 'incorrect_output' | 'bias' | 'privacy' | 'security' | 'availability' | 'misuse' | 'provider' | 'data' | 'human_oversight' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt?: string;
  reportedBy?: string;
  affectedUsers?: string;
  impact?: string;
  containment?: string;
  ownerId?: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  rootCause?: string;
  correctiveActionId?: string;
  closedAt?: string;
  createdAt?: string;
}

export interface AIProvider {
  id: string;
  organizationId: string;
  name: string;
  type?: string;
  service?: string;
  systemsAffected?: string[];
  contractOwner?: string;
  country?: string;
  dataLocation?: string;
  subprocessors?: string;
  riskRating?: string;
  assessmentStatus?: string;
  lastReview?: string;
  nextReview?: string;
  status?: string;
}

export interface AIHistory {
  id: string;
  organizationId: string;
  aiSystemId: string;
  userId: string;
  userName?: string;
  action: string;
  date: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  comment?: string;
}
