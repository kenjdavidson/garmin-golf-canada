import { type AuthSession, type GolfCanadaUser } from './types';

export interface AuthRepository {
  getSession(): AuthSession | undefined;
  setSession(session: AuthSession): void;
  clearSession(): void;
  getAccessToken(): string | undefined;
  getRefreshToken(): string | undefined;
  getUser(): GolfCanadaUser | undefined;
}

export class InMemoryAuthRepository implements AuthRepository {
  private session: AuthSession | undefined;

  getSession(): AuthSession | undefined {
    return this.session;
  }

  setSession(session: AuthSession): void {
    this.session = session;
  }

  clearSession(): void {
    this.session = undefined;
  }

  getAccessToken(): string | undefined {
    return this.session?.accessToken;
  }

  getRefreshToken(): string | undefined {
    return this.session?.refreshToken;
  }

  getUser(): GolfCanadaUser | undefined {
    return this.session?.user;
  }
}
