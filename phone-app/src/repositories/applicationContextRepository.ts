import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GarminMessage } from '../types/bluetooth';

export const APPLICATION_CONTEXT_STORAGE_KEY = '@golf-canada/application-context/v1';

export interface PersistedApplicationContext {
  lastGarminMessage: GarminMessage | null;
}

export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const defaultPersistedApplicationContext = (): PersistedApplicationContext => ({
  lastGarminMessage: null,
});

const normalizePersistedApplicationContext = (value: unknown): PersistedApplicationContext => {
  if (!value || typeof value !== 'object') {
    return defaultPersistedApplicationContext();
  }

  const record = value as Record<string, unknown>;
  const message = record.lastGarminMessage;
  if (message && typeof message === 'object') {
    const typedMessage = message as Record<string, unknown>;
    if (typedMessage.type === 'COURSE_DATA' && typeof typedMessage.courseName === 'string') {
      return {
        lastGarminMessage: {
          type: 'COURSE_DATA',
          courseName: typedMessage.courseName,
        },
      };
    }
    if (
      typedMessage.type === 'SCORE_UPDATE' &&
      typeof typedMessage.holeNumber === 'number' &&
      Number.isFinite(typedMessage.holeNumber) &&
      typeof typedMessage.strokes === 'number' &&
      Number.isFinite(typedMessage.strokes)
    ) {
      return {
        lastGarminMessage: {
          type: 'SCORE_UPDATE',
          holeNumber: typedMessage.holeNumber,
          strokes: typedMessage.strokes,
        },
      };
    }
  }

  return defaultPersistedApplicationContext();
};

export class ApplicationContextRepository {
  constructor(private readonly storage: KeyValueStorage = AsyncStorage) {}

  async load(): Promise<PersistedApplicationContext> {
    try {
      const rawValue = await this.storage.getItem(APPLICATION_CONTEXT_STORAGE_KEY);
      if (!rawValue) {
        return defaultPersistedApplicationContext();
      }

      return normalizePersistedApplicationContext(JSON.parse(rawValue));
    } catch {
      return defaultPersistedApplicationContext();
    }
  }

  async save(value: PersistedApplicationContext): Promise<void> {
    await this.storage.setItem(APPLICATION_CONTEXT_STORAGE_KEY, JSON.stringify(value));
  }

  async clear(): Promise<void> {
    await this.storage.removeItem(APPLICATION_CONTEXT_STORAGE_KEY);
  }
}
