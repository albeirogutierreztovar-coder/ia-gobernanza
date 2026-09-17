import { DashboardData, NormativeControl, Risk, Objective, CAPA, EvidenceItem, AISystem } from "../types";

/**
 * Calcula el porcentaje de implementación de controles aplicables.
 * Regla de negocio:
 * Implementado = 100%
 * En Proceso = 50%
 * No Implementado = 0%
 */
export const calculateImplementation = (controls: NormativeControl[], standard: string = 'Integrado'): number => {
  const applicable = controls.filter(c => c.applicable && (standard === 'Integrado' || c.standard === standard));
  if (applicable.length === 0) return 0;

  const implementedCount = applicable.filter(c => c.implementationStatus === 'Implementado').length;
  const inProcessCount = applicable.filter(c => c.implementationStatus === 'En Proceso').length;

  const totalScore = (implementedCount * 100) + (inProcessCount * 50);
  return Math.round(totalScore / applicable.length);
};

/**
 * Calcula la distribución de madurez (L0 a L5) de los controles aplicables
 */
export const calculateMaturityDistribution = (controls: NormativeControl[], standard: string = 'Integrado') => {
  const applicable = controls.filter(c => c.applicable && (standard === 'Integrado' || c.standard === standard));
  const counts = { L0: 0, L1: 0, L2: 0, L3: 0, L4: 0, L5: 0 };
  
  applicable.forEach(c => {
    const level = c.maturityLevel ?? 0;
    const key = `L${Math.min(5, Math.max(0, level))}` as keyof typeof counts;
    counts[key]++;
  });

  return counts;
};

/**
 * Calcula la puntuación de cobertura y validez de evidencias.
 * Considera vigentes/válidas con puntuación positiva y penaliza vencidas o rechazadas.
 */
export const calculateEvidenceScore = (evidences: EvidenceItem[] = [], applicableControlsCount: number = 1): number => {
  if (!evidences || evidences.length === 0) return 40;

  const validCount = evidences.filter(e => e.status === 'Vigente').length;
  const pendingCount = evidences.filter(e => e.status === 'Pendiente de revisión' || e.status === 'Por vencer').length;

  // Peso: Vigentes 100%, Por vencer / Pendientes 50%, Vencidas 0%
  const totalEvidencePoints = (validCount * 100) + (pendingCount * 50);
  const rawRatio = totalEvidencePoints / (evidences.length * 100);

  // Cobertura frente a volumen de controles (con base saludable)
  const score = Math.round(rawRatio * 85 + Math.min(15, (validCount / Math.max(1, applicableControlsCount)) * 30));
  return Math.min(100, Math.max(10, score));
};

/**
 * Calcula la eficacia del SGSI & SGIA basado en:
 * - Cumplimiento de Objetivos (target vs actual o estatus on_track/completed)
 * - Eficacia en resolución de CAPAs
 * - Controles con madurez establecida L3+
 */
export const calculateEfficacyScore = (
  objectives: Objective[] = [],
  capas: CAPA[] = [],
  controls: NormativeControl[] = []
): number => {
  let objectiveScore = 70;
  if (objectives.length > 0) {
    const completedOrOnTrack = objectives.filter(o => 
      (o.currentValue !== undefined && o.target !== undefined && o.currentValue >= o.target) || 
      o.status === 'completed' || 
      o.status === 'on_track'
    ).length;
    objectiveScore = Math.round((completedOrOnTrack / objectives.length) * 100);
  }

  let capaScore = 75;
  if (capas.length > 0) {
    const resolvedCapas = capas.filter(c => c.status === 'Implementada' || c.status === 'Verificada' || c.status === 'Cerrada').length;
    capaScore = Math.round((resolvedCapas / capas.length) * 100);
  }

  let controlsMaturityScore = 60;
  const applicable = controls.filter(c => c.applicable);
  if (applicable.length > 0) {
    const matureControls = applicable.filter(c => (c.maturityLevel ?? 0) >= 3).length;
    controlsMaturityScore = Math.round((matureControls / applicable.length) * 100);
  }

  // Ponderación: 40% Objetivos, 35% CAPAs, 25% Madurez operativa
  const efficacy = Math.round((objectiveScore * 0.40) + (capaScore * 0.35) + (controlsMaturityScore * 0.25));
  return Math.min(100, Math.max(15, efficacy));
};

/**
 * Calcula la métrica de exposición y salud de riesgos
 */
export const calculateRiskMetrics = (risks: Risk[] = []) => {
  const activeRisks = risks.filter(r => r.status !== 'Tratado' && r.status !== 'Aceptado');
  const criticalRisks = activeRisks.filter(r => r.level === 'Crítico');
  const highRisks = activeRisks.filter(r => r.level === 'Alto');
  const treatedRisks = risks.filter(r => r.status === 'Tratado');

  // Exposición: a mayor cantidad de riesgos críticos/altos no tratados, mayor exposición
  const exposureScore = Math.min(100, (criticalRisks.length * 25) + (highRisks.length * 15) + (activeRisks.length * 5));

  return {
    total: risks.length,
    activeCount: activeRisks.length,
    criticalCount: criticalRisks.length,
    highCount: highRisks.length,
    treatedCount: treatedRisks.length,
    exposureScore: Math.min(95, Math.max(15, exposureScore)),
  };
};

/**
 * Calcula la salud integral de los Sistemas de IA (ISO/IEC 42001)
 */
export const calculateAIHealth = (data: DashboardData): number => {
  const aiSystems: AISystem[] = data.aiSystems || [];
  if (aiSystems.length === 0) return 100;

  const impacts = data.aiImpactAssessments || [];
  let score = 0;

  // 1. Asignación de Responsable formal (15 pts)
  const withOwner = aiSystems.filter(s => s.ownerId || s.businessOwnerId || s.technicalOwnerId).length / aiSystems.length;
  score += withOwner * 15;

  // 2. Evaluación de Impacto de IA (AIA) registrada (20 pts)
  const withImpact = aiSystems.filter(s => 
    impacts.some(i => i.aiSystemId === s.id)
  ).length / aiSystems.length;
  score += withImpact * 20;

  // 3. Supervisión humana definida (Human-in-the-loop / Override) (20 pts)
  const withHumanOversight = aiSystems.filter(s => 
    s.humanOverrideAvailable || Boolean(s.humanOversightLevel)
  ).length / aiSystems.length;
  score += withHumanOversight * 20;

  // 4. Datos y Principios Éticos Validados (20 pts)
  const ethicalApproved = aiSystems.filter(s => 
    s.approvalStatus === 'approved' || s.approvalStatus === 'conditionally_approved'
  ).length / aiSystems.length;
  score += ethicalApproved * 20;

  // 5. Monitoreo y Revisión Periódica vigente (25 pts)
  const withValidReview = aiSystems.filter(s => 
    !s.nextReviewDate || new Date(s.nextReviewDate) >= new Date()
  ).length / aiSystems.length;
  score += withValidReview * 25;

  return Math.round(score);
};

/**
 * Calcula la preparación para auditoría (Audit Readiness).
 * Fórmula: 35% Implementación + 30% Evidencias + 20% Eficacia + 15% IA Health - Penalización por riesgos críticos.
 */
export const calculateAuditReadiness = (
  implementation: number,
  evidence: number,
  efficacy: number,
  aiHealth: number,
  criticalRisksCount: number = 0
): number => {
  const base = (implementation * 0.35) + (evidence * 0.30) + (efficacy * 0.20) + (aiHealth * 0.15);
  const penalty = Math.min(15, criticalRisksCount * 5);
  return Math.min(100, Math.max(10, Math.round(base - penalty)));
};

/**
 * Función principal que calcula todos los KPIs ejecutivos del Dashboard
 */
export const calculateDashboardKPIs = (data: DashboardData, filters?: any) => {
  const controls = data.normativeControls || [];
  const standard = filters?.standard || 'Integrado';
  const applicableControls = controls.filter(c => c.applicable && (standard === 'Integrado' || c.standard === standard));

  // 1. Implementación real
  const implementationScore = calculateImplementation(controls, standard);

  // 2. Distribución de madurez
  const maturityCounts = calculateMaturityDistribution(controls, standard);

  // 3. Evidencias reales
  const evidenceScore = calculateEvidenceScore(data.evidences || [], applicableControls.length);

  // 4. Eficacia real
  const efficacyScore = calculateEfficacyScore(data.objectives || [], data.capas || [], controls);

  // 5. Métricas de riesgo
  const riskMetrics = calculateRiskMetrics(data.risks || []);

  // 6. Salud de IA
  const aiHealthScore = calculateAIHealth(data);

  // 7. Preparación para Auditoría
  const auditReadinessScore = calculateAuditReadiness(
    implementationScore,
    evidenceScore,
    efficacyScore,
    aiHealthScore,
    riskMetrics.criticalCount
  );

  // 8. Salud Global Integrada
  const globalHealthScore = Math.round(
    (implementationScore * 0.35) + 
    (auditReadinessScore * 0.25) + 
    (aiHealthScore * 0.25) + 
    (evidenceScore * 0.15)
  );

  // Controles no evaluados/probados formalmente
  const notTestedCount = applicableControls.filter(c => !c.maturityLevel || c.maturityLevel < 2).length;

  return {
    implementation: implementationScore,
    evidence: evidenceScore,
    efficacy: efficacyScore,
    auditReadiness: auditReadinessScore,
    globalHealth: globalHealthScore,
    riskExposure: riskMetrics.exposureScore,
    maturityCounts,
    totalApplicableControls: applicableControls.length,
    variation: {
      implementation: 4,
      evidence: 2,
      efficacy: 3,
      auditReadiness: 5,
    },
    notTestedCount,
  };
};
