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

    STATUSES = ['Active', 'Inactive'];

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

}

const roleService = new RoleService();

export { roleService };
export type { Role };

