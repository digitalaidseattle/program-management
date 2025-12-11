
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
      tableName = '';
      select = '*';
      mapper = (json: any) => (json as any);

      constructor(tableName: string, select: string, mapper: any) {
        this.tableName = tableName;
        this.select = select ?? '*';
        this.mapper = mapper ?? ((json: any) => json);
      }
    },
    SupabaseAuthService: class {
      signInWithOAuth = vi.fn();
    },
    SupabaseStorageService: class {
      bucketName = '';

      constructor(bucketName: string) {
        this.bucketName = bucketName;
      }

      getUrl(path: string): string {
        return path + ':1';
      }
    },
  };
});

vi.mock('@digitalaidseattle/airtable', () => {
  return {
    AirtableEntityService: class {
      tableName = '';
    
      constructor(tableName: string) {
        this.tableName = tableName;
      }
    }
  };
});