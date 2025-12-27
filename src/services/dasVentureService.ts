/**
 *  dasVentureService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { PageInfo, QueryModel, supabaseClient } from "@digitalaidseattle/supabase";
import { Partner, partnerService } from "./dasPartnerService";
import { PMEntityService } from "./pmEntityService";

type Venture = {
    id: string
    airtable_id: string
    partner_id: string
    title: string
    painpoint: string
    status: string
    problem: string
    solution: string
    impact: string
    program_areas: string[];
    venture_code: string;
    partner_airtable_id: string[],
    partner?: Partner

}

const DEFAULT_SELECT = "*, partner(*)";

function MAPPER(json: any): Venture {
    const venture = {
        ...json,
        program_areas: JSON.parse(json.program_areas) ?? []
    }
    return venture;
}

<<<<<<< HEAD
class VentureService extends PMEntityService<Venture> {
=======
class VentureService extends SupabaseEntityService<Venture> {
    
    static STATUSES = [
        'Active',
        'Declined',
        'Ready for consideration',
        'Paused',
        'Delivered',
        'Submitted by Partner',
    ];

    static _instance: VentureService;

    static instance(): VentureService {
        if (!this._instance) {
            this._instance = new VentureService();
        }
        return this._instance;
    }
>>>>>>> 4da58ec (filtering)

    public constructor() {
        super("venture", DEFAULT_SELECT, MAPPER);
    }

    async find(queryModel: QueryModel, select?: string, mapper?: (json: any) => Venture): Promise<PageInfo<Venture>> {
        return super.find(queryModel, select ?? DEFAULT_SELECT, mapper);
    }

    async findByAirtableId(airtableId: string): Promise<Venture> {
        return await supabaseClient
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('airtable_id', airtableId)
            .single()
            .then((resp: any) => this.mapper(resp.data)!);
    }

    getLogoUrl(entity: Venture): string | undefined {
        return partnerService.getLogoUrl(entity.partner!);
    }

    async getActive(): Promise<Venture[]> {
        return this.findByStatus('Active');
    }

    async findByStatus(status: string): Promise<Venture[]> {
        return await supabaseClient
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('status', status)
            .then((resp: any) => resp.data.map((json: any) => this.mapper(json)));
    }

}

const ventureService = VentureService.instance();
export { ventureService, VentureService };
export type { Venture };

