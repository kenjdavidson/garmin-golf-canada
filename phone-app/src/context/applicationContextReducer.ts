import type { GarminMessage } from '../types/bluetooth';
import type { PersistedApplicationContext } from '../repositories/applicationContextRepository';
import { initialApplicationContextState, type ApplicationContextState } from './applicationContextState';

export type ApplicationContextAction =
  | { type: 'HYDRATE'; payload: PersistedApplicationContext }
  | { type: 'RECEIVE_GARMIN_MESSAGE'; message: GarminMessage }
  | { type: 'CLEAR' };

export const applicationContextReducer = (
  state: ApplicationContextState,
  action: ApplicationContextAction
): ApplicationContextState => {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        hydrated: true,
        lastGarminMessage: action.payload.lastGarminMessage,
        lastMessageType: action.payload.lastGarminMessage?.type ?? null,
      };
    case 'RECEIVE_GARMIN_MESSAGE':
      return {
        ...state,
        lastGarminMessage: action.message,
        lastMessageType: action.message.type,
      };
    case 'CLEAR':
      return {
        ...initialApplicationContextState,
        hydrated: true,
      };
    default:
      return state;
  }
};
