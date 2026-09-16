import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | { uid: string; email: string; displayName: string } | null;
  loading: boolean;
  currentOrgId: string | null;
  setCurrentOrgId: (orgId: string) => void;
  mockLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  currentOrgId: null,
  setCurrentOrgId: () => {},
  mockLogin: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a mock user in localStorage
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      setUser(JSON.parse(mockUser));
      setCurrentOrgId('org-nova');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setCurrentOrgId('org-nova');
      } else {
        setCurrentOrgId(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const mockLogin = () => {
    const fakeUser = {
      uid: 'demo-user-123',
      email: 'demo@empresa.com',
      displayName: 'Usuario Demo'
    };
    localStorage.setItem('mockUser', JSON.stringify(fakeUser));
    setUser(fakeUser);
    setCurrentOrgId('org-nova');
  };

  return (
    <AuthContext.Provider value={{ user, loading, currentOrgId, setCurrentOrgId, mockLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
