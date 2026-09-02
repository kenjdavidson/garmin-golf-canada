import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type { GarminMessage } from '../types/bluetooth';
import { ApplicationContextRepository } from '../repositories/applicationContextRepository';
import {
  applicationContextReducer,
  initialApplicationContextState,
  toPersistedApplicationContext,
  type ApplicationContextState,
} from './applicationContextState';

interface ApplicationContextValue {
  state: ApplicationContextState;
  setCourseData: (courseName: string) => void;
  setHoleScore: (holeNumber: number, strokes: number) => void;
  receiveGarminMessage: (message: GarminMessage) => void;
  clearStoredContext: () => Promise<void>;
}

const AppContext = createContext<ApplicationContextValue | undefined>(undefined);

interface AppContextProviderProps {
  children: React.ReactNode;
  repository?: ApplicationContextRepository;
}

export const AppContextProvider = ({ children, repository }: AppContextProviderProps) => {
  const contextRepository = useMemo(() => repository ?? new ApplicationContextRepository(), [repository]);
  const [state, dispatch] = useReducer(applicationContextReducer, initialApplicationContextState);

  useEffect(() => {
    let mounted = true;

    const hydrateState = async () => {
      const persistedState = await contextRepository.load();
      if (!mounted) {
        return;
      }

      dispatch({ type: 'HYDRATE', payload: persistedState });
    };

    void hydrateState();

    return () => {
      mounted = false;
    };
  }, [contextRepository]);

  const persistedState = useMemo(() => toPersistedApplicationContext(state), [state]);

  useEffect(() => {
    if (!state.hydrated) {
      return;
    }

    void contextRepository.save(persistedState);
  }, [contextRepository, persistedState, state.hydrated]);

  const setCourseData = useCallback((courseName: string) => {
    dispatch({ type: 'SET_COURSE_DATA', courseName });
  }, []);

  const setHoleScore = useCallback((holeNumber: number, strokes: number) => {
    dispatch({ type: 'SET_HOLE_SCORE', holeNumber, strokes });
  }, []);

  const receiveGarminMessage = useCallback((message: GarminMessage) => {
    dispatch({ type: 'RECEIVE_GARMIN_MESSAGE', message });
  }, []);

  const clearStoredContext = useCallback(async () => {
    await contextRepository.clear();
    dispatch({ type: 'CLEAR' });
  }, [contextRepository]);

  const value = useMemo(
    () => ({
      state,
      setCourseData,
      setHoleScore,
      receiveGarminMessage,
      clearStoredContext,
    }),
    [clearStoredContext, receiveGarminMessage, setCourseData, setHoleScore, state]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): ApplicationContextValue => {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }

  return value;
};
