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
}

const toolService = new ToolService();

export { toolService };
export type { Tool };

