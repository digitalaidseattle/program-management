import { User } from "@digitalaidseattle/core";
import { SupabaseConfiguration } from "@digitalaidseattle/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export abstract class AssociativeTableService<T> {

    tableName: string;
    client: SupabaseClient;

    constructor(table: string) {
        this.tableName = table;
        this.client = SupabaseConfiguration.getInstance().getSupabaseClient()
    }

    getClient(): SupabaseClient {
        return this.client;
    }

    async insert(entity: T, _user?: User): Promise<T[]> {
        try {
            const { data, error } = await this.getClient()
                .from(this.tableName)
                .insert([entity] as any)
                .select('*')
            if (error) {
                console.error('Error inserting entity:', error.message);
                throw new Error('Failed to insert entity');
            }
            return data;
        } catch (err) {
            console.error('Unexpected error during insertion:', err);
            throw err;
        }
    }

    async batchInsert(entities: T[], _user?: User): Promise<T[]> {
        try {
            const { data, error } = await this.getClient()
                .from(this.tableName)
                .insert(entities as any)
                .select('*')
            if (error) {
                console.error('Error inserting entity:', error.message);
                throw new Error('Failed to insert entity');
            }
            return data;
        } catch (err) {
            console.error('Unexpected error during insertion:', err);
            throw err;
        }
    }
}
