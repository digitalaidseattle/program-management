/**
 *  dasPartnerService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";

type Partner = {
    id: string;
    airtable_id: string;
    name: string
    type: string
    shorthand_name: string
    status: string
    description: string
    gdrive_link: string
    hubspot_link: string
    miro_link: string
    overview_link: string,
    logo_url: string,
    internal_champion: string[],
    website: string,
    foci: string[],
    ally_utility: string,
    general_phone: string,
    internal_thoughts: string
}

const DEFAULT_SELECT = '*';
class PartnerService extends SupabaseEntityService<Partner> {

    public constructor() {
        super("partner");
    }

    async findByAirtableId(airtableId: string): Promise<Partner> {
        return await supabaseClient
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('airtable_id', airtableId)
            .single()
            .then((resp: any) => resp.data);
    }
}

const partnerService = new PartnerService()
export { partnerService };
export type { Partner };

