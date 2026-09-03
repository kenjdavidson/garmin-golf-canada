import React from 'react';
import { createApiClient } from '../api/apiClient';
import { AuthApi } from '../api/authApi';
import { InMemoryAuthRepository } from '../auth/authRepository';
import { AsyncStorageAuthStorage, type AuthStorage } from '../auth/authStorage';
import { AuthService } from '../auth/authService';
import { AuthProvider, useAuth } from './authContext';

export interface ApplicationContextDependencies {
  authService: AuthService;
  authStorage: AuthStorage;
}

export const createApplicationContextDependencies = (): ApplicationContextDependencies => {
  const authRepository = new InMemoryAuthRepository();
  const apiClient = createApiClient({
    getAccessToken: () => authRepository.getAccessToken(),
  });
  const authApi = new AuthApi(apiClient);

  return {
    authService: new AuthService(authApi, authRepository),
    authStorage: new AsyncStorageAuthStorage(),
  };
};

const defaultDependencies = createApplicationContextDependencies();

export const AuthApplicationContextProvider = ({
  children,
  dependencies = defaultDependencies,
}: {
  children: React.ReactNode;
  dependencies?: ApplicationContextDependencies;
}) => (
  <AuthProvider authService={dependencies.authService} authStorage={dependencies.authStorage}>
    {children}
  </AuthProvider>
);

export const useApplicationContext = () => ({
  auth: useAuth(),
});
