/**
 *  dasPartnerService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";
import { storageService } from "../App";
import { AssociativeTableService } from "./associativeTableService";
import { Profile } from "./dasProfileService";
import { User } from "@digitalaidseattle/core";


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

type Profile2Partner = {
    profile_id: string;
    partner_id: string;
    partner?: Partner;
    profile?: Profile
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
    return partner;
}

class PartnerService extends SupabaseEntityService<Partner> {

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

    static _instance: PartnerService;

    static instance(): PartnerService {
        if (!this._instance) {
            this._instance = new PartnerService();
        }
        return this._instance;
    }

    public constructor() {
        super("partner", DEFAULT_SELECT, MAPPER);
    }

    async findByAirtableId(airtableId: string): Promise<Partner> {
        return await supabaseClient
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('airtable_id', airtableId)
            .single()
            .then((resp: any) => this.mapper(resp.data)!);
    }

    getLogoUrl(partner: Partner): string | undefined {
        return partner.logo_url ? storageService.getUrl(partner.logo_url) : undefined
    }

    getNextLogoUrl(entity: Partner): string {
        const current = entity.logo_url ? entity.logo_url.split(':') : [];
        const idx = current.length < 2 ? 1 : Number(current[1]);
        return `logos/${entity.id}:${idx}`; // idx helps deal with CDN
    }

    async findByStatus(status: string): Promise<Partner[]> {
        return await supabaseClient
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('status', status)
            .then((resp: any) => resp.data.map((json: any) => this.mapper(json)));
    }

    async findByType(type: string): Promise<Partner[]> {
        return await supabaseClient
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('type', type)
            .then((resp: any) => resp.data.map((json: any) => this.mapper(json)));
    }

}

class Profile2ProfileService extends AssociativeTableService<Profile2Partner> {

    public constructor() {
        super("profile2partner");
    }

    async update(partner_id: string, profile_id: string, changes: Partial<Profile2Partner>, _user?: User): Promise<Profile2Partner> {
        try {
            const { data, error } = await supabaseClient
                .from(this.tableName)
                .update(changes)
                .eq('partner_id', partner_id)
                .eq('profile_id', profile_id)
                .select('*')
                .single();
            if (error) {
                console.error('Error inserting entity:', error.message);
                throw new Error('Failed to insert entity');
            }
            return data;
        } catch (err) {
            console.error('Unexpected error during insertion:', err);
            throw err;
        }
    }

}

const partnerService = PartnerService.instance();
const profile2PartnerService = new Profile2ProfileService();

export { partnerService, profile2PartnerService, PartnerService };
export type { Contact, Partner, Profile2Partner };

