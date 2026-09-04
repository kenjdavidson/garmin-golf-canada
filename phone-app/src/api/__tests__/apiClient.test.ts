import test from 'node:test';
import assert from 'node:assert/strict';
import { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { createApiClient } from '../apiClient';

const responseFor = (config: AxiosRequestConfig): AxiosResponse => ({
  config,
  data: {},
  status: 200,
  statusText: 'OK',
  headers: {},
});

test('createApiClient injects bearer token when available', async () => {
  const client = createApiClient({
    getAccessToken: () => 'abc123',
  });

  let authHeader: string | undefined;
  client.defaults.adapter = async (config) => {
    authHeader = config.headers?.Authorization as string | undefined;
    return responseFor(config);
  };

  await client.get('/protected-resource');

  assert.ok(authHeader?.startsWith('Bearer '));
  assert.ok(authHeader?.endsWith('abc123'));
});

test('createApiClient preserves explicit authorization header', async () => {
  const client = createApiClient({
    getAccessToken: () => 'abc123',
  });

  let authHeader: string | undefined;
  client.defaults.adapter = async (config) => {
    authHeader = config.headers?.Authorization as string | undefined;
    return responseFor(config);
  };

  await client.get('/protected-resource', {
    headers: {
      Authorization: 'Basic custom',
    },
  });

  assert.equal(authHeader, 'Basic custom');
});
