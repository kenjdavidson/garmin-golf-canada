import type { ApplicationContextState } from './applicationContextState';

export const selectLastMessageType = (state: ApplicationContextState): string =>
  state.lastMessageType ?? 'No message received';
