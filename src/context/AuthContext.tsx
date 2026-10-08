import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ConsentRecord } from '../types';
import { teleSimStore } from '../services/store';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasConsent: boolean;
  consentRecord?: ConsentRecord;
  loginWithGoogle: (role?: 'USER' | 'ADMIN') => Promise<void>;
  logout: () => void;
  recordConsent: () => void;
  switchRole: (role: 'USER' | 'ADMIN') => void;
  refreshState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(teleSimStore.getUser());
  const [hasConsent, setHasConsent] = useState<boolean>(
    user ? teleSimStore.hasConsent(user.id) : false
  );
  const [consentRecord, setConsentRecord] = useState<ConsentRecord | undefined>(
    user ? teleSimStore.getConsent(user.id) : undefined
  );

  const sync = () => {
    const currentUser = teleSimStore.getUser();
    setUser(currentUser);
    if (currentUser) {
      setHasConsent(teleSimStore.hasConsent(currentUser.id));
      setConsentRecord(teleSimStore.getConsent(currentUser.id));
    } else {
      setHasConsent(false);
      setConsentRecord(undefined);
    }
  };

  useEffect(() => {
    return teleSimStore.subscribe(sync);
  }, []);

  const loginWithGoogle = async (role: 'USER' | 'ADMIN' = 'USER') => {
    // Simulates instant Google OAuth handshake with provider redirect & callback verification
    const loggedUser = teleSimStore.loginAs(role);
    setUser(loggedUser);
    setHasConsent(teleSimStore.hasConsent(loggedUser.id));
    setConsentRecord(teleSimStore.getConsent(loggedUser.id));
  };

  const logout = () => {
    teleSimStore.logout();
    setUser(null);
    setHasConsent(false);
    setConsentRecord(undefined);
  };

  const recordConsent = () => {
    if (!user) return;
    const rec = teleSimStore.recordConsent(user.id);
    setHasConsent(true);
    setConsentRecord(rec);
  };

  const switchRole = (role: 'USER' | 'ADMIN') => {
    loginWithGoogle(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'ADMIN',
        hasConsent,
        consentRecord,
        loginWithGoogle,
        logout,
        recordConsent,
        switchRole,
        refreshState: sync,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
