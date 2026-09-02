import type { GarminMessage } from '../types/bluetooth';
import type { PersistedApplicationContext } from '../repositories/applicationContextRepository';

export interface ApplicationContextState extends PersistedApplicationContext {
  hydrated: boolean;
  lastMessageType: GarminMessage['type'] | null;
}

export type ApplicationContextAction =
  | { type: 'HYDRATE'; payload: PersistedApplicationContext }
  | { type: 'SET_COURSE_DATA'; courseName: string }
  | { type: 'SET_HOLE_SCORE'; holeNumber: number; strokes: number }
  | { type: 'RECEIVE_GARMIN_MESSAGE'; message: GarminMessage }
  | { type: 'CLEAR' };

export const initialApplicationContextState: ApplicationContextState = {
  hydrated: false,
  courseName: null,
  scores: {},
  lastMessageType: null,
};

export const toPersistedApplicationContext = (state: ApplicationContextState): PersistedApplicationContext => ({
  courseName: state.courseName,
  scores: state.scores,
});

export const applicationContextReducer = (
  state: ApplicationContextState,
  action: ApplicationContextAction
): ApplicationContextState => {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        hydrated: true,
        courseName: action.payload.courseName,
        scores: action.payload.scores,
      };
    case 'SET_COURSE_DATA':
      return {
        ...state,
        courseName: action.courseName,
        lastMessageType: 'COURSE_DATA',
      };
    case 'SET_HOLE_SCORE':
      return {
        ...state,
        scores: {
          ...state.scores,
          [String(action.holeNumber)]: action.strokes,
        },
        lastMessageType: 'SCORE_UPDATE',
      };
    case 'RECEIVE_GARMIN_MESSAGE':
      if (action.message.type === 'COURSE_DATA') {
        return {
          ...state,
          courseName: action.message.courseName,
          lastMessageType: action.message.type,
        };
      }

      return {
        ...state,
        scores: {
          ...state.scores,
          [String(action.message.holeNumber)]: action.message.strokes,
        },
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
