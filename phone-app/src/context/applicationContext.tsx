import React from 'react';
import { createApiClient } from '../api/apiClient';
import { AuthApi } from '../api/authApi';
import { InMemoryAuthRepository } from '../auth/authRepository';
import { AsyncStorageAuthStorage } from '../auth/authStorage';
import { AuthService } from '../auth/authService';
import { AuthProvider, useAuth } from './authContext';

const authRepository = new InMemoryAuthRepository();
const apiClient = createApiClient({
  getAccessToken: () => authRepository.getAccessToken(),
});
const authApi = new AuthApi(apiClient);
const authService = new AuthService(authApi, authRepository);
const authStorage = new AsyncStorageAuthStorage();

export const ApplicationContextProvider = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider authService={authService} authStorage={authStorage}>
    {children}
  </AuthProvider>
);

export const useApplicationContext = () => ({
  auth: useAuth(),
});
