const fs = require('fs');
let code = fs.readFileSync('src/store/useStore.ts', 'utf8');

const replacement = `  addStakeholder: async (stakeholder) => {
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
  },`;

code = code.replace(/  addStakeholder: async \(stakeholder\) => \{[\s\S]*?\},/, replacement);
fs.writeFileSync('src/store/useStore.ts', code);
