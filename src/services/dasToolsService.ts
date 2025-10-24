/**
 *  dasToolService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";

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

    async findByAirtableId(airtableId: string): Promise<Tool> {
        return await supabaseClient
            .from(this.tableName)
            .select('*')
            .eq('airtable_id', airtableId)
            .single()
            .then((resp: any) => resp.data);
    }

    public constructor() {
        super("tool");
    }
}

const toolService = new ToolService();

export { toolService };
export type { Tool };

