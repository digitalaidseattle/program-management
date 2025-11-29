
import { vi } from 'vitest';

vi.mock('@digitalaidseattle/supabase', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithOAuth: vi.fn(),
      // etc.
    }
  })),
}));

vi.mock('@digitalaidseattle/supabase', () => {
  return {
    SupabaseEntityService: class {
      constructor(tableName: string) {
      }
    }
  };
});