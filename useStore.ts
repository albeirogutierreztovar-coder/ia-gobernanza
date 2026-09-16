import { create } from 'zustand';
import { DashboardData, Process, AISystem, Risk, Alert, RequirementAssessment, ControlAssessment, HealthSnapshot, ActivityLog, AuditItem, ImplementationAction, NormativeControl } from '../types';
import { collection, query, where, getDocs, doc, getDoc, orderBy, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AppState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  selectedStandard: string;
  setSelectedStandard: (standard: string) => void;
  fetchData: (orgId: string) => Promise<void>;
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

export const useStore = create<AppState>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  selectedStandard: 'Integrado',
  setSelectedStandard: (standard: string) => set({ selectedStandard: standard }),
  addNonConformity: async (nc) => {
    try {
      const docRef = await addDoc(collection(db, 'nonConformities'), {
        ...nc,
        createdAt: serverTimestamp()
      });
      
      // Update local state to avoid full refetch
      const currentData = get().data;
      if (currentData) {
        set({
          data: {
            ...currentData,
            nonConformities: [...(currentData.nonConformities || []), { id: docRef.id, ...nc }]
          }
        });
      }
    } catch (error: any) {
      console.error('Error adding NC:', error);
      throw error;
    }
  },
  addRisk: async (risk) => {
    try {
      const docRef = await addDoc(collection(db, 'risks'), {
        ...risk,
        createdAt: serverTimestamp()
      });
      
      const currentData = get().data;
      if (currentData) {
        set({
          data: {
            ...currentData,
            risks: [...(currentData.risks || []), { id: docRef.id, ...risk }]
          }
        });
      }
    } catch (error: any) {
      console.error('Error adding Risk:', error);
      throw error;
    }
  },
  addCapa: async (capa) => {
    try {
      const docRef = await addDoc(collection(db, 'capas'), {
        ...capa,
        createdAt: serverTimestamp()
      });
      
      const currentData = get().data;
      if (currentData) {
        set({
          data: {
            ...currentData,
            capas: [...(currentData.capas || []), { id: docRef.id, ...capa }]
          }
        });
      }
    } catch (error: any) {
      console.error('Error adding CAPA:', error);
      throw error;
    }
  },
  addObjective: async (objective) => {
    try {
      const docRef = await addDoc(collection(db, 'objectives'), {
        ...objective,
        createdAt: serverTimestamp(),
      });
      set((state) => ({
        data: {
          ...state.data,
          objectives: [...(state.data?.objectives || []), { id: docRef.id, ...objective }]
        }
      }));
    } catch (error) {
      console.error('Error adding Objective:', error);
      throw error;
    }
  },

  addStakeholder: async (stakeholder) => {
    try {
      const docRef = await addDoc(collection(db, 'stakeholders'), {
        ...stakeholder,
        createdAt: serverTimestamp(),
      });
      set((state) => ({
        data: {
          ...state.data,
          stakeholders: [...(state.data?.stakeholders || []), { id: docRef.id, ...stakeholder }]
        }
      }));
    } catch (error) {
      console.error('Error adding Stakeholder:', error);
      throw error;
    }
  },

  addGovernanceRole: async (role) => {
    try {
      const docRef = await addDoc(collection(db, 'governanceRoles'), {
        ...role,
        createdAt: serverTimestamp(),
      });
      set((state) => ({
        data: {
          ...state.data,
          governanceRoles: [...(state.data?.governanceRoles || []), { id: docRef.id, ...role }]
        }
      }));
    } catch (error) {
      console.error('Error adding Governance Role:', error);
      throw error;
    }
  },
  addAISystem: async (system) => {
    try {
      const docRef = await addDoc(collection(db, 'aiSystems'), {
        ...system,
        createdAt: serverTimestamp()
      });
      
      const currentData = get().data;
      if (currentData) {
        set({
          data: {
            ...currentData,
            aiSystems: [...(currentData.aiSystems || []), { id: docRef.id, ...system }]
          }
        });
      }
    } catch (error: any) {
      console.error('Error adding AI System:', error);
      throw error;
    }
  },
  updateNormativeControl: async (id, updates) => {
    try {
      const docRef = doc(db, 'normativeControls', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      const currentData = get().data;
      if (currentData && currentData.normativeControls) {
        set({
          data: {
            ...currentData,
            normativeControls: currentData.normativeControls.map(c => 
              c.id === id ? { ...c, ...updates } as NormativeControl : c
            )
          }
        });
      }
    } catch (error: any) {
      console.error('Error updating Normative Control:', error);
      throw error;
    }
  },
  addAuditSession: async (session) => {
    try {
      const docRef = await addDoc(collection(db, 'auditSessions'), {
        ...session,
        createdAt: serverTimestamp()
      });
      
      const currentData = get().data;
      if (currentData) {
        set({
          data: {
            ...currentData,
            auditSessions: [...(currentData.auditSessions || []), { id: docRef.id, ...session }]
          }
        });
      }
    } catch (error: any) {
      console.error('Error adding Audit Session:', error);
      throw error;
    }
  },
  fetchData: async (orgId: string) => {
    set({ loading: true, error: null });
    try {
      // Organization
      const orgDoc = await getDoc(doc(db, 'organizations', orgId));
      if (!orgDoc.exists()) throw new Error('Organización no encontrada');
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
        const q = query(collection(db, coll), where('organizationId', '==', orgId));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }));

      set({ 
        data: {
          organization,
          processes: results[0] as Process[],
          aiSystems: results[1] as AISystem[],
          risks: results[2] as Risk[],
          alerts: results[3] as Alert[],
          requirementAssessments: results[4] as RequirementAssessment[],
          controlAssessments: results[5] as ControlAssessment[],
          healthSnapshots: (results[6] as HealthSnapshot[]).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
          activityLogs: (results[7] as ActivityLog[]).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          auditItems: results[8] as AuditItem[],
          implementationActions: results[9] as ImplementationAction[],
          assessmentHistory: (results[10] as any[]).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          processInputs: results[11] as any[] || [],
          processOutputs: results[12] as any[] || [],
          processActivities: (results[13] as any[] || []).sort((a, b) => a.sequence - b.sequence),
          stakeholders: results[14] as any[] || [],
          governanceRoles: results[15] as any[] || [],
          objectives: results[16] as any[] || [],
          indicators: results[17] as any[] || [],
          indicatorMeasurements: (results[18] as any[] || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          processDependencies: results[19] as any[] || [],
          processHistory: (results[20] as any[] || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          aiImpactAssessments: results[21] as any[] || [],
          aiDataResources: results[22] as any[] || [],
          aiLifecycleEvents: (results[23] as any[] || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          aiIncidents: results[24] as any[] || [],
          aiProviders: results[25] as any[] || [],
          aiHistory: (results[26] as any[] || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          nonConformities: results[27] as any[] || [],
          capas: results[28] as any[] || [],
          normativeControls: results[29] as any[] || [],
          auditSessions: results[30] as any[] || [],
        }, 
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));
