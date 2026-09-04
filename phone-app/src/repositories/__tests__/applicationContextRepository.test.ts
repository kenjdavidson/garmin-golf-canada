import assert from 'node:assert/strict';
import test from 'node:test';
import {
  APPLICATION_AUTH_STORAGE_KEY,
  APPLICATION_CONTEXT_STORAGE_KEY,
  ApplicationContextRepository,
  type KeyValueStorage,
} from '../applicationContextRepository';
import { type AuthSession } from '../../auth/types';

class InMemoryStorage implements KeyValueStorage {
  private readonly values = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.values.get(key) ?? null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.values.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.values.delete(key);
  }
}

test('loads default state when no stored context exists', async () => {
  const repository = new ApplicationContextRepository(new InMemoryStorage());
  const value = await repository.load();

  assert.deepEqual(value, {
    lastGarminMessage: null,
  });
});

test('saves and loads persisted context', async () => {
  const storage = new InMemoryStorage();
  const repository = new ApplicationContextRepository(storage);
  const expected = {
    lastGarminMessage: {
      type: 'SCORE_UPDATE' as const,
      holeNumber: 2,
      strokes: 5,
    },
  };

  await repository.save(expected);

  const storedRawValue = await storage.getItem(APPLICATION_CONTEXT_STORAGE_KEY);
  assert.ok(storedRawValue);
  assert.deepEqual(JSON.parse(storedRawValue), expected);

  const loadedValue = await repository.load();
  assert.deepEqual(loadedValue, expected);
});

test('falls back to default state when stored context is invalid JSON', async () => {
  const storage = new InMemoryStorage();
  await storage.setItem(APPLICATION_CONTEXT_STORAGE_KEY, '{');

  const repository = new ApplicationContextRepository(storage);
  const value = await repository.load();

  assert.deepEqual(value, {
    lastGarminMessage: null,
  });
});

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

test('saves and loads auth session through application context repository', async () => {
  const storage = new InMemoryStorage();
  const repository = new ApplicationContextRepository(storage);

  await repository.saveAuthSession(sampleSession);

  const storedRawValue = await storage.getItem(APPLICATION_AUTH_STORAGE_KEY);
  assert.ok(storedRawValue);
  assert.deepEqual(JSON.parse(storedRawValue), sampleSession);

  const loadedSession = await repository.loadAuthSession();
  assert.deepEqual(loadedSession, sampleSession);
});

test('returns undefined when stored auth session is invalid JSON', async () => {
  const storage = new InMemoryStorage();
  await storage.setItem(APPLICATION_AUTH_STORAGE_KEY, '{');
  const repository = new ApplicationContextRepository(storage);

  const session = await repository.loadAuthSession();

  assert.equal(session, undefined);
});

test('returns undefined when stored auth session has invalid shape', async () => {
  const storage = new InMemoryStorage();
  await storage.setItem(APPLICATION_AUTH_STORAGE_KEY, JSON.stringify({ accessToken: 'partial-only' }));
  const repository = new ApplicationContextRepository(storage);

  const session = await repository.loadAuthSession();

  assert.equal(session, undefined);
});

test('returns undefined when stored auth session user has invalid shape', async () => {
  const storage = new InMemoryStorage();
  await storage.setItem(
    APPLICATION_AUTH_STORAGE_KEY,
    JSON.stringify({ ...sampleSession, user: {} }),
  );
  const repository = new ApplicationContextRepository(storage);

  const session = await repository.loadAuthSession();

  assert.equal(session, undefined);
});

test('clears stored auth session', async () => {
  const storage = new InMemoryStorage();
  const repository = new ApplicationContextRepository(storage);

  await repository.saveAuthSession(sampleSession);
  await repository.clearAuthSession();

  const loadedSession = await repository.loadAuthSession();
  assert.equal(loadedSession, undefined);
});
