import AsyncStorage from '@react-native-async-storage/async-storage';
import { type AuthSession } from './types';

const AUTH_SESSION_KEY = 'golf_canada_auth_session';
type StoredValue = string | null;

export interface AuthStorageBackend {
  getItem(key: string): Promise<StoredValue>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export interface AuthStorage {
  getSession(): Promise<AuthSession | undefined>;
  setSession(session: AuthSession): Promise<void>;
  clearSession(): Promise<void>;
}

export class AsyncStorageAuthStorage implements AuthStorage {
  constructor(private readonly backend: AuthStorageBackend = AsyncStorage) {}

  async getSession(): Promise<AuthSession | undefined> {
    const rawValue = await this.backend.getItem(AUTH_SESSION_KEY);

    if (!rawValue) {
      return undefined;
    }

    return JSON.parse(rawValue) as AuthSession;
  }

  async setSession(session: AuthSession): Promise<void> {
    await this.backend.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  }

  async clearSession(): Promise<void> {
    await this.backend.removeItem(AUTH_SESSION_KEY);
  }
}

export const AUTH_STORAGE_SESSION_KEY = AUTH_SESSION_KEY;
