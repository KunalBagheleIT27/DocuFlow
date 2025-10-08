import React, { createContext, useContext, useMemo, useState } from 'react';

type Role = 'Submitter' | 'Reviewer' | 'Approver';

type AuthContextValue = {
  isAuthenticated: boolean;
  user: { username: string; displayName?: string; role: Role } | null;
  login: (username: string, password: string, displayName?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextValue['user']>(() => {
    const raw = localStorage.getItem('docuflow_user');
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (username: string, password: string, displayName?: string) => {
    await new Promise((r) => setTimeout(r, 400));
    const role: Role = username.toLowerCase().includes('approver')
      ? 'Approver'
      : username.toLowerCase().includes('reviewer')
      ? 'Reviewer'
      : 'Submitter';
    const nextUser = { username, displayName, role } as const;
    setUser(nextUser as any);
    localStorage.setItem('docuflow_user', JSON.stringify(nextUser));
    const raw = localStorage.getItem('docuflow_logins');
    const logins: { username: string; at: string }[] = raw ? JSON.parse(raw) : [];
    logins.push({ username, at: new Date().toISOString() });
    localStorage.setItem('docuflow_logins', JSON.stringify(logins));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('docuflow_user');
  };

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated: !!user, user, login, logout }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}



