import { afterAll, beforeAll, vi } from 'vitest';

process.env.JWT_SECRET = 'test-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';

beforeAll(() => {
  console.log('Setting up tests...');

  vi.useFakeTimers();
});

afterAll(() => {
  console.log('Tearing down tests...');

  vi.useRealTimers();
  vi.resetAllMocks();
});
