import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthService } from '../auth/authService';
import { ApplicationContextRepository } from '../repositories/applicationContextRepository';
import { type AuthSession, type LoginCredentials } from '../auth/types';

export interface AuthContextValue {
  session: AuthSession | undefined;
  isHydrated: boolean;
  login(credentials: LoginCredentials): Promise<AuthSession>;
  refresh(): Promise<AuthSession>;
  logout(): Promise<void>;
}

interface AuthProviderProps {
  authService: AuthService;
  repository: ApplicationContextRepository;
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ authService, repository, children }: AuthProviderProps) => {
  const [session, setSession] = useState<AuthSession | undefined>(authService.getSession());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrateSession = async () => {
      const storedSession = await repository.loadAuthSession();
      if (storedSession) {
        authService.restoreSession(storedSession);
        setSession(storedSession);
      }
      setIsHydrated(true);
    };

    void hydrateSession();
  }, [authService, repository]);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    isHydrated,
    login: async (credentials) => {
      const nextSession = await authService.login(credentials);
      setSession(nextSession);
      await repository.saveAuthSession(nextSession);
      return nextSession;
    },
    refresh: async () => {
      const nextSession = await authService.refresh();
      setSession(nextSession);
      await repository.saveAuthSession(nextSession);
      return nextSession;
    },
    logout: async () => {
      await authService.logout();
      setSession(undefined);
      await repository.clearAuthSession();
    },
  }), [authService, repository, isHydrated, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
