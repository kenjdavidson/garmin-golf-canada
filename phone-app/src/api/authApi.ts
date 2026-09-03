import { type AxiosInstance } from 'axios';
import { type GolfCanadaAuthResponse, type LoginCredentials } from '../auth/types';

const TOKEN_SCOPE = 'address email offline_access openid phone profile roles';

export class AuthApi {
  constructor(private readonly client: AxiosInstance) {}

  login(credentials: LoginCredentials): Promise<GolfCanadaAuthResponse> {
    return this.postTokenRequest({
      grant_type: 'password',
      username: credentials.username,
      password: credentials.password,
      scope: TOKEN_SCOPE,
    });
  }

  refresh(refreshToken: string): Promise<GolfCanadaAuthResponse> {
    return this.postTokenRequest({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      scope: TOKEN_SCOPE,
    });
  }

  private async postTokenRequest(formValues: Record<string, string>): Promise<GolfCanadaAuthResponse> {
    const payload = new URLSearchParams(formValues);
    const { data } = await this.client.post<GolfCanadaAuthResponse>('/connect/token', payload.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return data;
  }
}
