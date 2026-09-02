import assert from 'node:assert/strict';
import test from 'node:test';
import {
  APPLICATION_CONTEXT_STORAGE_KEY,
  ApplicationContextRepository,
  type KeyValueStorage,
} from './applicationContextRepository';

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
    courseName: null,
    scores: {},
  });
});

test('saves and loads persisted context', async () => {
  const storage = new InMemoryStorage();
  const repository = new ApplicationContextRepository(storage);
  const expected = {
    courseName: 'Championship',
    scores: { '1': 4, '2': 3 },
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
    courseName: null,
    scores: {},
  });
});
