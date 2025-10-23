/**
 *  dasVolunteerService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";


type Discipline = {
    id: string,
    name: string,
    volunteer_ids: string[],
    details: string,
    senior_ids: string[],
    slack: string,
    status: string
}

class DisciplineService extends SupabaseEntityService<Discipline> {

    public constructor() {
        super("discipline");
    }

    async findByAirtableId(airtableId: string): Promise<Discipline> {
        return await supabaseClient
            .from(this.tableName)
            .select('*')
            .eq('airtable_id', airtableId)
            .single()
            .then((resp: any) => resp.data);
    }

}

const disciplineService = new DisciplineService();

export { disciplineService };
export type { Discipline };

