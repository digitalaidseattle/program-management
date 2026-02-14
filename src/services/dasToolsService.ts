/**
 *  dasToolService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";
import { storageService } from "../App";

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

class ToolService extends SupabaseEntityService<Tool> {

    static STATUSES = [
        'active',
        'inactive',
    ];

    static _instance: ToolService;

    static instance(): ToolService {
        if (!this._instance) {
            this._instance = new ToolService();
        }
        return this._instance;
    }
    public constructor() {
        super("tool");
    }

    async findByAirtableId(airtableId: string): Promise<Tool> {
        return await supabaseClient
            .from(this.tableName)
            .select('*')
            .eq('airtable_id', airtableId)
            .single()
            .then((resp: any) => resp.data);

    }

    getLogoUrl(tool: Tool): string | undefined {
        return tool.logo ? storageService.getUrl(tool.logo) : undefined
    }

    getNextLocation(tool: Tool): string {
        const current = tool.logo ? tool.logo.split(':') : [];
        const idx = current.length < 2 ? 1 : Number(current[1]);
        return `logos/${tool.id}:${idx}`; // idx helps deal with CDN
    }

    async findByStatus(status: string): Promise<Tool[]> {
        return await supabaseClient
            .from(this.tableName)
            .select('*')
            .eq('status', status)
            .then((resp: any) => resp.data.map((json: any) => this.mapper(json)));
    }
}

const toolService = ToolService.instance();

export { toolService, ToolService };
export type { Tool };

