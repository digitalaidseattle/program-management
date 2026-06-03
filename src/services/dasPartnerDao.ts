/**
 *  dasPartnerService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { SupabaseConfiguration, SupabaseDAO } from "@digitalaidseattle/supabase";
import { Profile } from "./dasProfileService";

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
    contact?: Contact[]
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
    return partner;
}

class PartnerDao extends SupabaseDAO<Partner> {

    static STATUSES = [
        'Official relationship',
        'Warm relationship',
        'Cold relationship',
        'Do not contact'
    ];

    static TYPES = [
        'Partner',
        'Ally'
    ];

    static _instance: PartnerDao;

    static getInstance(): PartnerDao {
        if (!this._instance) {
            this._instance = new PartnerDao();
        }
        return this._instance;
    }

    public constructor() {
        super(
            SupabaseConfiguration.getInstance().getSupabaseClient(),
            "partner",
            { select: DEFAULT_SELECT, mapper: MAPPER }
        );
    }

    async findByAirtableId(airtableId: string): Promise<Partner> {
        return await this.client
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('airtable_id', airtableId)
            .single()
            .then((resp: any) => this.mapper(resp.data)!);
    }



    async findByStatus(status: string): Promise<Partner[]> {
        return await this.client
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('status', status)
            .then((resp: any) => resp.data.map((json: any) => this.mapper(json)));
    }

    async findByType(type: string): Promise<Partner[]> {
        return await this.client
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('type', type)
            .then((resp: any) => resp.data.map((json: any) => this.mapper(json)));
    }

}



export { PartnerDao };
export type { Contact, Partner };

