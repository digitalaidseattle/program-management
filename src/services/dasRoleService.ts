/**
 *  dasVolunteerService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Entity, supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";
import { storageService } from "../App";

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

class RoleService extends SupabaseEntityService<Role> {

<<<<<<< HEAD
    static STATUSES = ['Active', 'Inactive'];

    static _instance: RoleService;

    static instance(): RoleService {
        if (!this._instance) {
            this._instance = new RoleService();
        }
        return this._instance;
    }
=======
    STATUSES = ['Active', 'Inactive'];
>>>>>>> b09b223 (reference views for roles)

    public constructor() {
        super("role");
    }

    async findByAirtableId(airtableId: string): Promise<Role> {
        return await supabaseClient
            .from(this.tableName)
            .select('*')
            .eq('airtable_id', airtableId)
            .single()
            .then((resp: any) => resp.data);
    }

    getIconUrl(entity: Role): string | undefined {
        return entity.pic ? storageService.getUrl(entity.pic) : undefined
    }

<<<<<<< HEAD
    async findByStatus(status: string): Promise<Role[]> {
        return await supabaseClient
            .from(this.tableName)
            .select('*')
            .eq('status', status)
            .then((resp: any) => resp.data.map((json: any) => this.mapper(json)));
    }
=======
>>>>>>> b09b223 (reference views for roles)
}

const roleService = RoleService.instance();

export { roleService, RoleService };
export type { Role };

