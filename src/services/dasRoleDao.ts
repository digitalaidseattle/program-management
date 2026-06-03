/**
 *  dasVolunteerService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Entity } from "@digitalaidseattle/core";
import { SupabaseConfiguration, SupabaseDAO } from "@digitalaidseattle/supabase";

type Role = Entity & {
    pic: string | null;
    name: string;
    status: string;
    urgency: number;
    headline: string; // 'Headline'
    location: string;  // 'Location'
    responsibilities: string; // 'Responsibilities
    qualifications: string; // 'Preferred Qualifications
    key_attributes: string; //Key attributes for success
    tags: string[]; //Role tags
}

class RoleDao extends SupabaseDAO<Role> {

    static STATUSES = ['Active', 'Inactive'];

    static _instance: RoleDao;

    static getInstance(): RoleDao {
        if (!this._instance) {
            this._instance = new RoleDao();
        }
        return this._instance;
    }

    public constructor() {
        super(SupabaseConfiguration.getInstance().getSupabaseClient(), "role");
    }

    async findByAirtableId(airtableId: string): Promise<Role> {
        return await this.client
            .from(this.tableName)
            .select('*')
            .eq('airtable_id', airtableId)
            .single()
            .then((resp: any) => resp.data);
    }

    async findByStatus(status: string): Promise<Role[]> {
        return await this.client
            .from(this.tableName)
            .select('*')
            .eq('status', status)
            .then((resp: any) => resp.data.map((json: any) => this.mapper(json)));
    }
}


export { RoleDao };
export type { Role };

