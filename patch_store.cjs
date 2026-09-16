const fs = require('fs');
let code = fs.readFileSync('src/store/useStore.ts', 'utf8');

const replacement = `  addObjective: async (objective) => {
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
  },`;

code = code.replace(/  addObjective: async \(objective\) => \{[\s\S]*?\},/, replacement);
fs.writeFileSync('src/store/useStore.ts', code);
