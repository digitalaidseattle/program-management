
import { vi } from 'vitest';

vi.mock('./src/services/associativeTableService', () => {
  return {
    AssociativeTableService: class {
      constructor(_tableName: string) {
      }
      insert = vi.fn();
      update = vi.fn();
    }
  }
});

vi.mock('@digitalaidseattle/supabase', () => {
  return {
    supabaseClient: {},
    SupabaseEntityService: class {
      tableName = '';
      select = '*';
      mapper = (json: any) => (json as any);

      constructor(tableName: string, select: string, mapper: any) {
        this.tableName = tableName;
        this.select = select ?? '*';
        this.mapper = mapper ?? ((json: any) => json);
      }

      insert = vi.fn();
      batchInsert = vi.fn();
      getById = vi.fn();
      delete = vi.fn();
      update = vi.fn();
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
      removeFile = vi.fn();
      upload = vi.fn();
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