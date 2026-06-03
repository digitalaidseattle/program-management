/**
 *  dasToolService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { SupabaseConfiguration, SupabaseDAO } from "@digitalaidseattle/supabase";

type Tool = {
    id: string,
    airtable_id: string,
    name: string,
    experts: string[],
    status: string,
    overview: string,
    logo: string,
    description: string,
    teams: string[],
    admins: string[]
}

class ToolsDao extends SupabaseDAO<Tool> {

    static STATUSES = [
        'active',
        'inactive',
    ];

    static _instance: ToolsDao;

    static getInstance(): ToolsDao {
        if (!this._instance) {
            this._instance = new ToolsDao();
        }
        return this._instance;
    }

    public constructor() {
        super(SupabaseConfiguration.getInstance().getSupabaseClient(), "tool");
    }

    async findByAirtableId(airtableId: string): Promise<Tool> {
        return await SupabaseConfiguration.getInstance().getSupabaseClient()
            .from(this.tableName)
            .select('*')
            .eq('airtable_id', airtableId)
            .single()
            .then((resp: any) => resp.data);

    }

    async findByStatus(status: string): Promise<Tool[]> {
        return await SupabaseConfiguration.getInstance().getSupabaseClient()
            .from(this.tableName)
            .select('*')
            .eq('status', status)
            .then((resp: any) => resp.data.map((json: any) => this.mapper(json)));
    }
}


export { ToolsDao };
export type { Tool };

