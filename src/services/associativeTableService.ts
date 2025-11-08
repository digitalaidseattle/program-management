import { User } from "@digitalaidseattle/core";
import { supabaseClient } from "@digitalaidseattle/supabase";

export class AssociativeTableService<T> {

    tableName: string;

    constructor(table: string) {
        this.tableName = table;
    }
    async insert(entity: T, _user?: User): Promise<T[]> {
        try {
            const { data, error } = await supabaseClient
                .from(this.tableName)
                .insert(entity)
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
            const { data, error } = await supabaseClient
                .from(this.tableName)
                .insert(entities)
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
