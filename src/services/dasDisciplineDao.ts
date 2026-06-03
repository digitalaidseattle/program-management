/**
 *  dasVolunteerService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { SupabaseConfiguration, SupabaseDAO } from "@digitalaidseattle/supabase";


type Discipline = {
    id: string,
    airtable_id: string, // eligible to delete after final migration
    name: string,
    volunteer_ids: string[],  // eligible to delete after final migration
    details: string,
    senior_ids: string[], // eligible to delete after final migration
    slack: string,
    status: string,
    icon: string // remove optional one day
}

class DisciplineDao extends SupabaseDAO<Discipline> {

    static STATUSES = [
        'Public',
        'Internal'
    ];

    static _instance: DisciplineDao;

    static getInstance(): DisciplineDao {
        if (!this._instance) {
            this._instance = new DisciplineDao();
        }
        return this._instance;
    }

    public constructor() {
        super(SupabaseConfiguration.getInstance().getSupabaseClient(), "discipline");
    }

    async findByAirtableId(airtableId: string): Promise<Discipline> {
        return await this.client
            .from(this.tableName)
            .select('*')
            .eq('airtable_id', airtableId)
            .single()
            .then((resp: any) => resp.data);
    }

    async findByStatus(status: string): Promise<Discipline[]> {
        return await this.client
            .from(this.tableName)
            .select('*')
            .eq('status', status)
            .then((resp: any) => resp.data.map((json: any) => this.mapper(json)));
    }
}


export { DisciplineDao };
export type { Discipline };

