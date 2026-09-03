import test from 'node:test';
import assert from 'node:assert/strict';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { AuthApi } from '../authApi';
import { type GolfCanadaAuthResponse } from '../../auth/types';

const mockResponse: GolfCanadaAuthResponse = {
  token_type: 'Bearer',
  access_token: 'access-token',
  expires_in: 3600,
  refresh_token: 'refresh-token',
  id_token: 'id-token',
  expire_date: '2026-09-02T21:39:33.2330348Z',
  user: {
    id: 1,
    authUserId: 2,
    networkId: 3,
    golfCanadaCardId: '5200000000',
    username: 'TESTUSER',
    fullName: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    handicap: '7.0',
    pcc: '',
    email: 'test@example.com',
    isAdmin: false,
    isNationalAdmin: false,
    isNationalLookupAdmin: false,
    isAssociationAdmin: false,
    isSystemAdmin: false,
    isTournamentAdmin: false,
    isHandicapChair: false,
    isLimitedClubAdmin: false,
    isPending: false,
    membershipLevel: 'Gold',
    expirationDate: '2027-02-01T00:00:00',
    clubManagementGroupId: 8,
    termsAndConditionsDate: '2026-03-16T09:40:29',
    isClubManagingUpgrades: true,
    allowScorePosting: true,
    subscriptionRenewsOn: null,
    scoreDefaults: {
      nationalAssociation: 'RCGA',
      facilityId: 20598,
      facilityName: 'Blue Springs Golf Club',
      courseId: 20599,
      teeId: 83281,
      postHoleByHole: true,
    },
  },
};

const responseFor = (config: AxiosRequestConfig): AxiosResponse<GolfCanadaAuthResponse> => ({
  config,
  data: mockResponse,
  status: 200,
  statusText: 'OK',
  headers: {},
});

test('AuthApi.login posts password grant payload', async () => {
  const client = axios.create();
  const authApi = new AuthApi(client);

  let requestData = '';
  let contentType = '';

  client.defaults.adapter = async (config) => {
    requestData = config.data as string;
    contentType = String(config.headers?.['Content-Type'] ?? '');
    return responseFor(config);
  };

  const response = await authApi.login({ username: 'my-user', password: 'my-pass' });

  assert.equal(response, mockResponse);
  const params = new URLSearchParams(requestData);
  assert.equal(params.get('grant_type'), 'password');
  assert.equal(params.get('username'), 'my-user');
  assert.equal(params.get('password'), 'my-pass');
  assert.equal(params.get('scope'), 'address email offline_access openid phone profile roles');
  assert.equal(contentType, 'application/x-www-form-urlencoded');
});

test('AuthApi.refresh posts refresh token grant payload', async () => {
  const client = axios.create();
  const authApi = new AuthApi(client);

  let requestData = '';

  client.defaults.adapter = async (config) => {
    requestData = config.data as string;
    return responseFor(config);
  };

  await authApi.refresh('refresh-token-abc');

  const params = new URLSearchParams(requestData);
  assert.equal(params.get('grant_type'), 'refresh_token');
  assert.equal(params.get('refresh_token'), 'refresh-token-abc');
  assert.equal(params.get('scope'), 'address email offline_access openid phone profile roles');
});
