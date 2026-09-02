import test from 'node:test';
import assert from 'node:assert/strict';
import axios from 'axios';
import { AuthApi } from '../../api/authApi';
import { AuthService } from '../authService';
import { InMemoryAuthRepository } from '../authRepository';

const createResponse = (accessToken: string, refreshToken: string) => ({
  token_type: 'Bearer',
  access_token: accessToken,
  expires_in: 3600,
  refresh_token: refreshToken,
  id_token: `${accessToken}-id`,
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
});

test('AuthService.login stores returned auth session', async () => {
  const client = axios.create();
  let callCount = 0;

  client.defaults.adapter = async () => {
    callCount += 1;
    return {
      data: createResponse('access-1', 'refresh-1'),
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
  };

  const authService = new AuthService(new AuthApi(client), new InMemoryAuthRepository());

  const session = await authService.login({ username: 'u', password: 'p' });

  assert.equal(callCount, 1);
  assert.equal(session.accessToken, 'access-1');
  assert.equal(authService.getSession()?.refreshToken, 'refresh-1');
});

test('AuthService.refresh uses stored refresh token and updates session', async () => {
  const client = axios.create();
  let callCount = 0;

  client.defaults.adapter = async () => {
    callCount += 1;
    return {
      data: callCount === 1 ? createResponse('access-1', 'refresh-1') : createResponse('access-2', 'refresh-2'),
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
  };

  const authService = new AuthService(new AuthApi(client), new InMemoryAuthRepository());
  await authService.login({ username: 'u', password: 'p' });

  const refreshedSession = await authService.refresh();

  assert.equal(callCount, 2);
  assert.equal(refreshedSession.accessToken, 'access-2');
  assert.equal(authService.getSession()?.refreshToken, 'refresh-2');
});

test('AuthService.refresh throws when refresh token does not exist', async () => {
  const authService = new AuthService(new AuthApi(axios.create()), new InMemoryAuthRepository());

  await assert.rejects(
    authService.refresh(),
    /No refresh token available/,
  );
});
