export interface GolfCanadaScoreDefaults {
  nationalAssociation: string;
  facilityId: number;
  facilityName: string;
  courseId: number;
  teeId: number;
  postHoleByHole: boolean;
}

export interface GolfCanadaUser {
  id: number;
  authUserId: number;
  networkId: number;
  golfCanadaCardId: string;
  username: string;
  fullName: string;
  firstName: string;
  lastName: string;
  handicap: string;
  pcc: string;
  email: string;
  isAdmin: boolean;
  isNationalAdmin: boolean;
  isNationalLookupAdmin: boolean;
  isAssociationAdmin: boolean;
  isSystemAdmin: boolean;
  isTournamentAdmin: boolean;
  isHandicapChair: boolean;
  isLimitedClubAdmin: boolean;
  isPending: boolean;
  membershipLevel: string;
  expirationDate: string;
  clubManagementGroupId: number;
  termsAndConditionsDate: string;
  isClubManagingUpgrades: boolean;
  allowScorePosting: boolean;
  subscriptionRenewsOn: string | null;
  scoreDefaults: GolfCanadaScoreDefaults;
}

export interface GolfCanadaAuthResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  id_token: string;
  user: GolfCanadaUser;
  expire_date: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthSession {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  idToken: string;
  user: GolfCanadaUser;
  expireDate: string;
}
