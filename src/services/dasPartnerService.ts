/**
 *  dasPartnerService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { PageInfo, QueryModel, supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";
import { Profile } from "./dasProfileService";
import { AssociativeTableService } from "./associativeTableService";
import { Identifier } from "@digitalaidseattle/core";

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
    internal_thoughts: string,
    contact: Contact[]
}

type Profile2Partner = {
    profile_id: string;
    partner_id: string;
    title: string;
}

type Contact = Profile & {
    title: string;
}

const DEFAULT_SELECT = '*, profile2partner(*, profile(*))';

function MAPPER(json: any): Partner {
    const partner = {
        ...json,
        contact: json.profile2partner
            .map((p2p: any) => (
                {
                    ...p2p.profile,
                    title: p2p.title
                }
            ))
    }
    delete partner.profile2partner;
    console.log(partner);
    return partner;
}

class PartnerService extends SupabaseEntityService<Partner> {

    public constructor() {
        super("partner", DEFAULT_SELECT, MAPPER);
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

class Profile2ProfileService extends AssociativeTableService<Profile2Partner> {

    public constructor() {
        super("profile2partner");
    }

}

const partnerService = new PartnerService();
const profile2PartnerService = new Profile2ProfileService();

export { partnerService, profile2PartnerService };
export type { Partner, Profile2Partner, Contact };

