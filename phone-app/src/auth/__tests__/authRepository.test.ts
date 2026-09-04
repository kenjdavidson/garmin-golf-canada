import test from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryAuthRepository } from '../authRepository';
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

test('InMemoryAuthRepository stores and clears auth session', () => {
  const repository = new InMemoryAuthRepository();

  assert.equal(repository.getSession(), undefined);

  repository.setSession(sampleSession);

  assert.equal(repository.getSession(), sampleSession);
  assert.equal(repository.getAccessToken(), sampleSession.accessToken);
  assert.equal(repository.getRefreshToken(), sampleSession.refreshToken);
  assert.equal(repository.getUser(), sampleSession.user);

  repository.clearSession();

  assert.equal(repository.getSession(), undefined);
  assert.equal(repository.getAccessToken(), undefined);
  assert.equal(repository.getRefreshToken(), undefined);
  assert.equal(repository.getUser(), undefined);
});
