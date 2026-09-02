import type { GarminMessage } from '../types/bluetooth';
import type { PersistedApplicationContext } from '../repositories/applicationContextRepository';

export interface ApplicationContextState extends PersistedApplicationContext {
  hydrated: boolean;
  lastMessageType: GarminMessage['type'] | null;
}

export const initialApplicationContextState: ApplicationContextState = {
  hydrated: false,
  lastGarminMessage: null,
  lastMessageType: null,
};

export const toPersistedApplicationContext = (state: ApplicationContextState): PersistedApplicationContext => ({
  lastGarminMessage: state.lastGarminMessage,
});
