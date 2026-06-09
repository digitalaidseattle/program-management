/**
 *  dasVentureService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { v4 as uuid } from 'uuid';

import { DataAccessOptions, PageInfo, QueryModel } from "@digitalaidseattle/core";
import { SupabaseEntityService } from "@digitalaidseattle/supabase";
import { PartnerService } from "./dasPartnerService";
import { Venture, VentureDAO } from './dasVentureDao';

class VentureService extends SupabaseEntityService<Venture> {

    static STATUSES = VentureDAO.STATUSES;

    static _instance: VentureService;

    static getInstance(): VentureService {
        if (!this._instance) {
            this._instance = new VentureService();
        }
        return this._instance;
    }


    public constructor() {
        super(VentureDAO.getInstance());
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

    getDao(): VentureDAO {
        return this.dao as VentureDAO;
    }
    async find(queryModel: QueryModel, options?: DataAccessOptions<Venture>): Promise<PageInfo<Venture>> {
        return this.getDao().find(queryModel, options);
    }

    async findByAirtableId(airtableId: string): Promise<Venture> {
        return this.getDao().findByAirtableId(airtableId);
    }

    getLogoUrl(entity: Venture): string | undefined {
        return PartnerService.getInstance().getLogoUrl(entity.partner!);
    }

    async getActive(): Promise<Venture[]> {
        return this.findByStatus('Active');
    }

    async findByStatus(status: string): Promise<Venture[]> {
        return this.getDao().findByStatus(status);
    }

}

export { VentureService };
export type { Venture };

