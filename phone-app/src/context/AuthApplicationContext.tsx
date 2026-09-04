import React from 'react';
import { createApiClient } from '../api/apiClient';
import { AuthApi } from '../api/authApi';
import { InMemoryAuthRepository } from '../auth/authRepository';
import { AuthService } from '../auth/authService';
import { ApplicationContextRepository } from '../repositories/applicationContextRepository';
import { AuthProvider, useAuth } from './authContext';

export interface ApplicationContextDependencies {
  authService: AuthService;
  repository: ApplicationContextRepository;
}

export const createApplicationContextDependencies = (): ApplicationContextDependencies => {
  const authRepository = new InMemoryAuthRepository();
  const repository = new ApplicationContextRepository();
  const apiClient = createApiClient({
    getAccessToken: () => authRepository.getAccessToken(),
  });
  const authApi = new AuthApi(apiClient);

  return {
    authService: new AuthService(authApi, authRepository),
    repository,
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
  <AuthProvider authService={dependencies.authService} repository={dependencies.repository}>
    {children}
  </AuthProvider>
);

export const useApplicationContext = () => ({
  auth: useAuth(),
});
