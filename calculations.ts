import { DashboardData } from "../types";

export const calculateDashboardKPIs = (data: DashboardData, filters?: any) => {
  const controls = data.normativeControls || [];
  const standard = filters?.standard || 'Integrado';
  
  const applicableControls = controls.filter(c => c.applicable && (standard === 'Integrado' || c.standard === standard));
  
  let implementationScore = 0;
  
  // Real calculation for implementation
  if (applicableControls.length > 0) {
    const implementedControls = applicableControls.filter(c => c.implementationStatus === 'Implementado').length;
    const inProcessControls = applicableControls.filter(c => c.implementationStatus === 'En Proceso').length;
    
    // Logic: Implementado = 100%, En Proceso = 50%, No Implementado = 0%
    const totalScore = (implementedControls * 100) + (inProcessControls * 50);
    implementationScore = Math.round(totalScore / applicableControls.length);
  }

  // Calculate maturity distribution
  const maturityCounts = { L0: 0, L1: 0, L2: 0, L3: 0, L4: 0, L5: 0 };
  applicableControls.forEach(c => {
    const level = c.maturityLevel || 0;
    maturityCounts[`L${level}` as keyof typeof maturityCounts]++;
  });

  return {
    implementation: implementationScore,
    evidence: 45, // Placeholder for other modules
    efficacy: 32, // Placeholder
    auditReadiness: Math.round(implementationScore * 0.7), // Simplistic calculation based on implementation
    globalHealth: implementationScore,
    maturityCounts,
    totalApplicableControls: applicableControls.length,
    variation: {
      implementation: 0,
      evidence: 0,
      efficacy: 0,
      auditReadiness: 0,
    },
    notTestedCount: 12,
  };
};

export const calculateAIHealth = (data: DashboardData) => {
  const aiSystems = data.aiSystems || [];
  if (aiSystems.length === 0) return 100;

  const impacts = data.aiImpactAssessments || [];
  let score = 0;

  const withOwner =
    aiSystems.filter((s) => s.ownerId).length / aiSystems.length;
  score += withOwner * 15;

  const withImpact =
    aiSystems.filter((s) => impacts.some((i) => i.aiSystemId === s.id)).length /
    aiSystems.length;
  score += withImpact * 15;

  score += 15; // riesgos
  score += 15; // controles
  score += 5; // datos (half)
  score += 5; // doc (half)
  score += 5; // monitoreo (half)
  score += 5; // terceros

  const withValidReview =
    aiSystems.filter(
      (s) => !s.nextReviewDate || new Date(s.nextReviewDate) >= new Date(),
    ).length / aiSystems.length;
  score += withValidReview * 5;

  return Math.round(score);
};
