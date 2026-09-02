import AsyncStorage from '@react-native-async-storage/async-storage';

export const APPLICATION_CONTEXT_STORAGE_KEY = '@golf-canada/application-context/v1';

export interface PersistedApplicationContext {
  courseName: string | null;
  scores: Record<string, number>;
}

export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const defaultPersistedApplicationContext = (): PersistedApplicationContext => ({
  courseName: null,
  scores: {},
});

const normalizePersistedApplicationContext = (value: unknown): PersistedApplicationContext => {
  if (!value || typeof value !== 'object') {
    return defaultPersistedApplicationContext();
  }

  const record = value as Record<string, unknown>;
  const courseName = typeof record.courseName === 'string' ? record.courseName : null;

  const scores: Record<string, number> = {};
  if (record.scores && typeof record.scores === 'object') {
    for (const [hole, strokes] of Object.entries(record.scores)) {
      if (typeof strokes === 'number' && Number.isFinite(strokes)) {
        scores[hole] = strokes;
      }
    }
  }

  return { courseName, scores };
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
