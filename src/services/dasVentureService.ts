/**
 *  dasVentureService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { PageInfo, QueryModel, supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";
import { Partner } from "./dasPartnerService";

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
    program_areas: string
    venture_code: string;
    partner_airtable_id: string[],
    partner?: Partner

}

const DEFAULT_SELECT = "*, partner(*)"
class VentureService extends SupabaseEntityService<Venture> {
    public constructor() {
        super("venture", DEFAULT_SELECT);
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
            .then((resp: any) => resp.data);
    }
}

const ventureService = new VentureService()
export { ventureService };
export type { Venture };

