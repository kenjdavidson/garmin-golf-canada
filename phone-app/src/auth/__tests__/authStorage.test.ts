import test from 'node:test';
import assert from 'node:assert/strict';
import { AsyncStorageAuthStorage, AUTH_STORAGE_SESSION_KEY, type AuthStorageBackend } from '../authStorage';
import { type AuthSession } from '../types';

const sampleSession: AuthSession = {
  tokenType: 'Bearer',
  accessToken: 'access-token',
  expiresIn: 3600,
  refreshToken: 'refresh-token',
  idToken: 'id-token',
  expireDate: '2026-09-02T21:39:33.2330348Z',
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

const createInMemoryBackend = (): AuthStorageBackend => {
  const inMemory = new Map<string, string>();

  return {
    getItem: async (key) => inMemory.get(key) ?? null,
    setItem: async (key, value) => {
      inMemory.set(key, value);
    },
    removeItem: async (key) => {
      inMemory.delete(key);
    },
  };
};

test('AsyncStorageAuthStorage stores and loads auth session', async () => {
  const storage = new AsyncStorageAuthStorage(createInMemoryBackend());

  assert.equal(await storage.getSession(), undefined);

  await storage.setSession(sampleSession);

  const loaded = await storage.getSession();

  assert.equal(loaded?.accessToken, sampleSession.accessToken);
  assert.equal(loaded?.user.username, sampleSession.user.username);
});

test('AsyncStorageAuthStorage clears stored auth session', async () => {
  const storage = new AsyncStorageAuthStorage(createInMemoryBackend());

  await storage.setSession(sampleSession);
  await storage.clearSession();

  assert.equal(await storage.getSession(), undefined);
});

test('AsyncStorageAuthStorage uses expected storage key', async () => {
  let usedKey: string | undefined;

  const backend: AuthStorageBackend = {
    getItem: async (key) => {
      usedKey = key;
      return null;
    },
    setItem: async () => undefined,
    removeItem: async () => undefined,
  };

  const storage = new AsyncStorageAuthStorage(backend);
  await storage.getSession();

  assert.equal(usedKey, AUTH_STORAGE_SESSION_KEY);
});
