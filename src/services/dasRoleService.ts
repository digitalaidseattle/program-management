/**
 *  dasVolunteerService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";


type Role = {
    id: string,
    name: string,
    status: string,
    urgency: string,
}

class RoleService extends SupabaseEntityService<Role> {

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

}

const roleService = new RoleService();

export { roleService };
export type { Role };

