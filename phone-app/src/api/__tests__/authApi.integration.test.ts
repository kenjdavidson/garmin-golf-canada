import test from 'node:test';
import assert from 'node:assert/strict';
import { createApiClient, GOLF_CANADA_BASE_URL } from '../apiClient';
import { AuthApi } from '../authApi';

const username = process.env.GOLFCANADA_USERNAME;
const password = process.env.GOLFCANADA_PASSWORD;

const shouldRun = Boolean(username && password);

test('AuthApi login and refresh integration', { skip: !shouldRun }, async () => {
  const authApi = new AuthApi(createApiClient({ baseURL: GOLF_CANADA_BASE_URL }));

  const loginResponse = await authApi.login({
    username: username as string,
    password: password as string,
  });

  assert.equal(loginResponse.token_type, 'Bearer');
  assert.equal(typeof loginResponse.access_token, 'string');
  assert.equal(typeof loginResponse.refresh_token, 'string');
  assert.equal(typeof loginResponse.user.username, 'string');

  const refreshResponse = await authApi.refresh(loginResponse.refresh_token);

  assert.equal(refreshResponse.token_type, 'Bearer');
  assert.equal(typeof refreshResponse.access_token, 'string');
});
