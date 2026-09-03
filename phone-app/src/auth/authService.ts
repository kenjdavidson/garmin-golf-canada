import { AuthApi } from '../api/authApi';
import { type AuthRepository } from './authRepository';
import { type AuthSession, type LoginCredentials } from './types';

export class AuthService {
  constructor(
    private readonly authApi: AuthApi,
    private readonly authRepository: AuthRepository,
  ) {}

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await this.authApi.login(credentials);
    const session = this.toSession(response);
    this.authRepository.setSession(session);
    return session;
  }

  async refresh(): Promise<AuthSession> {
    const refreshToken = this.authRepository.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.authApi.refresh(refreshToken);
    const session = this.toSession(response);
    this.authRepository.setSession(session);
    return session;
  }

  logout(): void {
    this.authRepository.clearSession();
  }

  getSession(): AuthSession | undefined {
    return this.authRepository.getSession();
  }

  restoreSession(session: AuthSession): void {
    this.authRepository.setSession(session);
  }

  private toSession(response: {
    token_type: string;
    access_token: string;
    expires_in: number;
    refresh_token: string;
    id_token: string;
    user: AuthSession['user'];
    expire_date: string;
  }): AuthSession {
    return {
      tokenType: response.token_type,
      accessToken: response.access_token,
      expiresIn: response.expires_in,
      refreshToken: response.refresh_token,
      idToken: response.id_token,
      user: response.user,
      expireDate: response.expire_date,
    };
  }
}
