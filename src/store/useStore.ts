import { create } from 'zustand';
import { DashboardData, Process, AISystem, Risk, Alert, RequirementAssessment, ControlAssessment, HealthSnapshot, ActivityLog, AuditItem, ImplementationAction, NormativeControl, Organization } from '../types';
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { initialDashboardData } from '../data/initialData';

interface AppState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  selectedStandard: string;
  setSelectedStandard: (standard: string) => void;
  fetchData: (orgId: string) => Promise<void>;
  updateOrganization: (updates: Partial<Organization>) => Promise<void>;
  resetToDefaultData: () => Promise<void>;
  importData: (imported: DashboardData) => Promise<void>;
  addNonConformity: (nc: any) => Promise<void>;
  addRisk: (risk: any) => Promise<void>;
  addCapa: (capa: any) => Promise<void>;
  addObjective: (objective: any) => Promise<void>;
  addStakeholder: (stakeholder: any) => Promise<void>;
  addGovernanceRole: (role: any) => Promise<void>;
  addAISystem: (system: any) => Promise<void>;
  updateNormativeControl: (id: string, updates: Partial<NormativeControl>) => Promise<void>;
  addAuditSession: (session: any) => Promise<void>;
}

const getStorageKey = (orgId: string) => `app_data_${orgId}`;

const saveToLocalStorage = (orgId: string, data: DashboardData) => {
  try {
    localStorage.setItem(getStorageKey(orgId), JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save data to localStorage:', e);
  }
};

const getFromLocalStorage = (orgId: string): DashboardData | null => {
  try {
    const raw = localStorage.getItem(getStorageKey(orgId));
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read data from localStorage:', e);
  }
  return null;
};

export const useStore = create<AppState>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  selectedStandard: 'Integrado',
  setSelectedStandard: (standard: string) => set({ selectedStandard: standard }),

  updateOrganization: async (updates: Partial<Organization>) => {
    const currentData = get().data;
    if (!currentData) return;

    const orgId = currentData.organization.id;
    try {
      if (auth.currentUser) {
        const docRef = doc(db, 'organizations', orgId);
        await updateDoc(docRef, updates as any);
      }
    } catch (e) {
      console.warn('Firestore organization update skipped or failed:', e);
    }

    const updatedOrg = { ...currentData.organization, ...updates };
    const updatedData: DashboardData = {
      ...currentData,
      organization: updatedOrg
    };
    set({ data: updatedData });
    saveToLocalStorage(orgId, updatedData);
  },

  resetToDefaultData: async () => {
    const defaultData = initialDashboardData;
    const orgId = defaultData.organization.id;
    set({ data: defaultData });
    saveToLocalStorage(orgId, defaultData);
  },

  importData: async (imported: DashboardData) => {
    if (!imported || !imported.organization) {
      throw new Error('El archivo importado no tiene una estructura válida de AIGobernanza 360');
    }
    const orgId = imported.organization.id || 'org-nova';
    set({ data: imported });
    saveToLocalStorage(orgId, imported);
  },

  addNonConformity: async (nc) => {
    let id = `nc-${Date.now()}`;
    try {
      if (auth.currentUser) {
        const docRef = await addDoc(collection(db, 'nonConformities'), {
          ...nc,
          createdAt: serverTimestamp()
        });
        id = docRef.id;
      }
    } catch (e) {
      console.warn('Firestore write skipped or failed:', e);
    }
    
    const currentData = get().data;
    if (currentData) {
      const updated = {
        ...currentData,
        nonConformities: [...(currentData.nonConformities || []), { id, ...nc }]
      };
      set({ data: updated });
      saveToLocalStorage(currentData.organization.id, updated);
    }
  },

  addRisk: async (risk) => {
    let id = `risk-${Date.now()}`;
    try {
      if (auth.currentUser) {
        const docRef = await addDoc(collection(db, 'risks'), {
          ...risk,
          createdAt: serverTimestamp()
        });
        id = docRef.id;
      }
    } catch (e) {
      console.warn('Firestore write skipped or failed:', e);
    }
    
    const currentData = get().data;
    if (currentData) {
      const updated = {
        ...currentData,
        risks: [...(currentData.risks || []), { id, ...risk }]
      };
      set({ data: updated });
      saveToLocalStorage(currentData.organization.id, updated);
    }
  },

  addCapa: async (capa) => {
    let id = `capa-${Date.now()}`;
    try {
      if (auth.currentUser) {
        const docRef = await addDoc(collection(db, 'capas'), {
          ...capa,
          createdAt: serverTimestamp()
        });
        id = docRef.id;
      }
    } catch (e) {
      console.warn('Firestore write skipped or failed:', e);
    }
    
    const currentData = get().data;
    if (currentData) {
      const updated = {
        ...currentData,
        capas: [...(currentData.capas || []), { id, ...capa }]
      };
      set({ data: updated });
      saveToLocalStorage(currentData.organization.id, updated);
    }
  },

  addObjective: async (objective) => {
    let id = `obj-${Date.now()}`;
    try {
      if (auth.currentUser) {
        const docRef = await addDoc(collection(db, 'objectives'), {
          ...objective,
          createdAt: serverTimestamp(),
        });
        id = docRef.id;
      }
    } catch (e) {
      console.warn('Firestore write skipped or failed:', e);
    }

    const currentData = get().data;
    if (currentData) {
      const updated = {
        ...currentData,
        objectives: [...(currentData.objectives || []), { id, ...objective }]
      };
      set({ data: updated });
      saveToLocalStorage(currentData.organization.id, updated);
    }
  },

  addStakeholder: async (stakeholder) => {
    let id = `sh-${Date.now()}`;
    try {
      if (auth.currentUser) {
        const docRef = await addDoc(collection(db, 'stakeholders'), {
          ...stakeholder,
          createdAt: serverTimestamp(),
        });
        id = docRef.id;
      }
    } catch (e) {
      console.warn('Firestore write skipped or failed:', e);
    }

    const currentData = get().data;
    if (currentData) {
      const updated = {
        ...currentData,
        stakeholders: [...(currentData.stakeholders || []), { id, ...stakeholder }]
      };
      set({ data: updated });
      saveToLocalStorage(currentData.organization.id, updated);
    }
  },

  addGovernanceRole: async (role) => {
    let id = `role-${Date.now()}`;
    try {
      if (auth.currentUser) {
        const docRef = await addDoc(collection(db, 'governanceRoles'), {
          ...role,
          createdAt: serverTimestamp(),
        });
        id = docRef.id;
      }
    } catch (e) {
      console.warn('Firestore write skipped or failed:', e);
    }

    const currentData = get().data;
    if (currentData) {
      const updated = {
        ...currentData,
        governanceRoles: [...(currentData.governanceRoles || []), { id, ...role }]
      };
      set({ data: updated });
      saveToLocalStorage(currentData.organization.id, updated);
    }
  },

  addAISystem: async (system) => {
    let id = `ai-${Date.now()}`;
    try {
      if (auth.currentUser) {
        const docRef = await addDoc(collection(db, 'aiSystems'), {
          ...system,
          createdAt: serverTimestamp()
        });
        id = docRef.id;
      }
    } catch (e) {
      console.warn('Firestore write skipped or failed:', e);
    }
    
    const currentData = get().data;
    if (currentData) {
      const updated = {
        ...currentData,
        aiSystems: [...(currentData.aiSystems || []), { id, ...system }]
      };
      set({ data: updated });
      saveToLocalStorage(currentData.organization.id, updated);
    }
  },

  updateNormativeControl: async (id: string, updates: Partial<NormativeControl>) => {
    try {
      if (auth.currentUser) {
        const docRef = doc(db, 'normativeControls', id);
        await updateDoc(docRef, updates);
      }
    } catch (e) {
      console.warn('Firestore update skipped or failed:', e);
    }
    
    const currentData = get().data;
    if (currentData && currentData.normativeControls) {
      const updated = {
        ...currentData,
        normativeControls: currentData.normativeControls.map(c => 
          c.id === id ? { ...c, ...updates } as NormativeControl : c
        )
      };
      set({ data: updated });
      saveToLocalStorage(currentData.organization.id, updated);
    }
  },

  addAuditSession: async (session) => {
    let id = `aud-${Date.now()}`;
    try {
      if (auth.currentUser) {
        const docRef = await addDoc(collection(db, 'auditSessions'), {
          ...session,
          createdAt: serverTimestamp()
        });
        id = docRef.id;
      }
    } catch (e) {
      console.warn('Firestore write skipped or failed:', e);
    }
    
    const currentData = get().data;
    if (currentData) {
      const updated = {
        ...currentData,
        auditSessions: [...(currentData.auditSessions || []), { id, ...session }]
      };
      set({ data: updated });
      saveToLocalStorage(currentData.organization.id, updated);
    }
  },

  fetchData: async (orgId: string) => {
    set({ loading: true, error: null });

    // Check local storage first for immediate display
    const cached = getFromLocalStorage(orgId);
    if (cached) {
      set({ data: cached, loading: false, error: null });
    }

    // If authenticated in Firebase, attempt to fetch live data from Firestore
    if (auth.currentUser) {
      try {
        const orgDoc = await getDoc(doc(db, 'organizations', orgId));
        if (orgDoc.exists()) {
          const organization = { id: orgDoc.id, ...orgDoc.data() } as any;

          const collectionsToFetch = [
            'processes', 'aiSystems', 'risks', 'alerts', 
            'requirementAssessments', 'controlAssessments', 
            'healthSnapshots', 'activityLogs', 'auditItems', 'implementationActions', 'assessmentHistory',
            'processInputs', 'processOutputs', 'processActivities', 'stakeholders', 'governanceRoles',
            'objectives', 'indicators', 'indicatorMeasurements', 'processDependencies', 'processHistory',
            'aiImpactAssessments', 'aiDataResources', 'aiLifecycleEvents', 'aiIncidents', 'aiProviders', 'aiHistory',
            'nonConformities', 'capas', 'normativeControls', 'auditSessions'
          ];

          const results = await Promise.all(collectionsToFetch.map(async (coll) => {
            try {
              const q = query(collection(db, coll), where('organizationId', '==', orgId));
              const snap = await getDocs(q);
              return snap.docs.map(d => ({ id: d.id, ...d.data() }));
            } catch {
              return [];
            }
          }));

          const liveData: DashboardData = {
            organization,
            processes: (results[0] as Process[]).length > 0 ? (results[0] as Process[]) : initialDashboardData.processes,
            aiSystems: (results[1] as AISystem[]).length > 0 ? (results[1] as AISystem[]) : initialDashboardData.aiSystems,
            risks: (results[2] as Risk[]).length > 0 ? (results[2] as Risk[]) : initialDashboardData.risks,
            alerts: (results[3] as Alert[]).length > 0 ? (results[3] as Alert[]) : initialDashboardData.alerts,
            requirementAssessments: (results[4] as RequirementAssessment[]).length > 0 ? (results[4] as RequirementAssessment[]) : initialDashboardData.requirementAssessments,
            controlAssessments: (results[5] as ControlAssessment[]).length > 0 ? (results[5] as ControlAssessment[]) : initialDashboardData.controlAssessments,
            healthSnapshots: ((results[6] as HealthSnapshot[]).length > 0 ? (results[6] as HealthSnapshot[]) : initialDashboardData.healthSnapshots).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
            activityLogs: ((results[7] as ActivityLog[]).length > 0 ? (results[7] as ActivityLog[]) : initialDashboardData.activityLogs).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            auditItems: (results[8] as AuditItem[]).length > 0 ? (results[8] as AuditItem[]) : initialDashboardData.auditItems,
            implementationActions: (results[9] as ImplementationAction[]).length > 0 ? (results[9] as ImplementationAction[]) : initialDashboardData.implementationActions,
            assessmentHistory: ((results[10] as any[]).length > 0 ? (results[10] as any[]) : initialDashboardData.assessmentHistory).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            processInputs: results[11] as any[] || initialDashboardData.processInputs,
            processOutputs: results[12] as any[] || initialDashboardData.processOutputs,
            processActivities: ((results[13] as any[] || initialDashboardData.processActivities)).sort((a: any, b: any) => a.sequence - b.sequence),
            stakeholders: (results[14] as any[]).length > 0 ? (results[14] as any[]) : initialDashboardData.stakeholders,
            governanceRoles: (results[15] as any[]).length > 0 ? (results[15] as any[]) : initialDashboardData.governanceRoles,
            objectives: (results[16] as any[]).length > 0 ? (results[16] as any[]) : initialDashboardData.objectives,
            indicators: (results[17] as any[]).length > 0 ? (results[17] as any[]) : initialDashboardData.indicators,
            indicatorMeasurements: ((results[18] as any[] || initialDashboardData.indicatorMeasurements)).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            processDependencies: results[19] as any[] || initialDashboardData.processDependencies,
            processHistory: ((results[20] as any[] || initialDashboardData.processHistory)).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            aiImpactAssessments: (results[21] as any[]).length > 0 ? (results[21] as any[]) : initialDashboardData.aiImpactAssessments,
            aiDataResources: results[22] as any[] || initialDashboardData.aiDataResources,
            aiLifecycleEvents: ((results[23] as any[] || initialDashboardData.aiLifecycleEvents)).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            aiIncidents: results[24] as any[] || initialDashboardData.aiIncidents,
            aiProviders: (results[25] as any[]).length > 0 ? (results[25] as any[]) : initialDashboardData.aiProviders,
            aiHistory: ((results[26] as any[] || initialDashboardData.aiHistory)).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            nonConformities: (results[27] as any[]).length > 0 ? (results[27] as any[]) : initialDashboardData.nonConformities,
            capas: (results[28] as any[]).length > 0 ? (results[28] as any[]) : initialDashboardData.capas,
            normativeControls: (results[29] as any[]).length > 0 ? (results[29] as any[]) : initialDashboardData.normativeControls,
            auditSessions: (results[30] as any[]).length > 0 ? (results[30] as any[]) : initialDashboardData.auditSessions,
          };

          set({ data: liveData, loading: false, error: null });
          saveToLocalStorage(orgId, liveData);
          return;
        }
      } catch (firestoreError: any) {
        console.warn('Firestore fetch encountered an issue, falling back safely:', firestoreError);
      }
    }

    // Fallback: If not found in Firestore, unauthenticated (Demo mode), or permission error, use cached or initial seed data
    const finalData = cached || initialDashboardData;
    set({ data: finalData, loading: false, error: null });
    saveToLocalStorage(orgId, finalData);
  }
}));
