/**
 *  VentureDAO.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { v4 as uuid } from 'uuid';

import { DataAccessOptions, PageInfo, QueryModel } from "@digitalaidseattle/core";
import { SupabaseConfiguration, SupabaseDAO } from "@digitalaidseattle/supabase";
import { Partner } from "./dasPartnerService";

type Venture = {
    id: string
    airtable_id: string
    coda_id?: string;
    partner_id: string | null;
    title: string;
    painpoint: string;
    status: string;
    problem: string;
    solution: string;
    impact: string;
    program_areas: string[];
    venture_code: string;
    partner_airtable_id: string[],
    partner?: Partner;
}

const DEFAULT_SELECT = "*, partner(*)";

class VentureDAO extends SupabaseDAO<Venture> {

    static STATUSES = [
        'Active',
        'Declined',
        'Ready for consideration',
        'Paused',
        'Delivered',
        'Submitted by Partner',
    ];

    private static _instance: VentureDAO;

    static getInstance(): VentureDAO {
        if (!this._instance) {
            this._instance = new VentureDAO();
        }
        return this._instance;
    }

    public constructor() {
        super(SupabaseConfiguration.getInstance().getSupabaseClient(), DEFAULT_SELECT);
    }

    empty(): Venture {
        return {
            id: uuid(),
            airtable_id: '',
            partner_id: null,
            title: '',
            painpoint: '',
            status: '',
            problem: '',
            solution: '',
            impact: '',
            program_areas: [],
            venture_code: '',
            partner_airtable_id: [],
        } as Venture;
    }

    async find(queryModel: QueryModel, options?: DataAccessOptions<Venture>): Promise<PageInfo<Venture>> {
        return super.find(queryModel, options);
    }

    async findByAirtableId(airtableId: string): Promise<Venture> {
        return await SupabaseConfiguration.getInstance().getSupabaseClient()
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('airtable_id', airtableId)
            .single()
            .then((resp: any) => this.mapper(resp.data)!);
    }

    async getActive(): Promise<Venture[]> {
        return this.findByStatus('Active');
    }

    async findByStatus(status: string): Promise<Venture[]> {
        return await SupabaseConfiguration.getInstance().getSupabaseClient()
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('status', status)
            .then((resp: any) => resp.data.map((json: any) => this.mapper(json)));
    }

}

export { VentureDAO };
export type { Venture };

