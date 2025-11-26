/**
 *  dasVolunteerService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";
import { storageService } from "../App";


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

    getIconUrl(entity: Discipline): string | undefined {
        return storageService.getUrl(entity.icon);
    }

    getNextLocation(entity: Discipline): string {
        const current = entity.icon ? entity.icon.split(':') : [];
        const idx = current.length < 2 ? 1 : Number(current[1]);
        return `icons/${entity.icon}:${idx}`; // idx helps deal with CDN
    }

}

const disciplineService = new DisciplineService();

export { disciplineService };
export type { Discipline };

