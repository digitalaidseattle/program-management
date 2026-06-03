/**
 *  dasPartnerService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { getCoreServices, PageInfo, QueryModel, User } from "@digitalaidseattle/core";
import { SupabaseEntityService } from "@digitalaidseattle/supabase";
import { AssociativeTableService } from "./associativeTableService";
import { Contact, Partner, PartnerDao } from "./dasPartnerDao";
import { Profile } from "./dasProfileService";


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

    private static _instance: PartnerService;

    static getInstance(): PartnerService {
        if (!this._instance) {
            this._instance = new PartnerService();
        }
        return this._instance;
    }

    public constructor() {
        super(PartnerDao.getInstance());
    }

    getDao(): PartnerDao {
        return this.dao as PartnerDao;
    }

    async find(queryModel: QueryModel): Promise<PageInfo<Partner>> {
        return this.getDao().find(queryModel);
    }

    async findByAirtableId(airtableId: string): Promise<Partner> {
        return this.getDao().findByAirtableId(airtableId);
    }

    getLogoUrl(partner: Partner): string | undefined {
        const storageService = getCoreServices().storageService!;
        return partner.logo_url ? storageService.getUrl(partner.logo_url) : undefined
    }

    getNextLogoUrl(entity: Partner): string {
        const current = entity.logo_url ? entity.logo_url.split(':') : [];
        const idx = current.length < 2 ? 1 : Number(current[1]);
        return `logos/${entity.id}:${idx}`; // idx helps deal with CDN
    }

    async findByStatus(status: string): Promise<Partner[]> {
        return this.getDao().findByStatus(status);
    }

    async findByType(type: string): Promise<Partner[]> {
        return this.getDao().findByType(type);
    }

}


type Profile2Partner = {
    profile_id: string;
    partner_id: string;
    partner?: Partner;
    profile?: Profile
    title: string;
}

class Profile2PartnerService extends AssociativeTableService<Profile2Partner> {

    private static _instance: Profile2PartnerService;

    static getInstance(): Profile2PartnerService {
        if (!this._instance) {
            this._instance = new Profile2PartnerService();
        }
        return this._instance;
    }

    public constructor() {
        super("profile2partner");
    }

    async update(partner_id: string, profile_id: string, changes: Partial<Profile2Partner>, _user?: User): Promise<Profile2Partner> {
        try {
            const { data, error } = await this.getClient()
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

export { PartnerService, Profile2PartnerService };
export type { Contact, Partner, Profile2Partner };

