/**
 *  dasVolunteer2ToolService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Identifier } from "@digitalaidseattle/core";
import { supabaseClient } from "@digitalaidseattle/supabase";
import { Tool } from "./dasToolsService";
import { Volunteer } from "./dasVolunteerService";
import { AssociativeTableService } from "./associativeTableService";


type Volunteer2Tool = {
    volunteer_id: string,
    tool_id: string,
    expert: boolean
}

const ASSOC_TABLE = 'volunteer2tool';
class DASVolunteer2ToolService extends AssociativeTableService<Volunteer2Tool> {

    constructor() {
        super(ASSOC_TABLE)
    }

    addToolToVolunteer(tool: Tool, volunteer: Volunteer): Promise<boolean> {
        return supabaseClient
            .from(this.tableName)
            .insert(
                {
                    tool_id: tool.id,
                    volunteer_id: volunteer.id,
                }
            )
            .select();
    }

    removeToolFromVolunteer(tool: Tool, volunteer: Volunteer): Promise<boolean> {
        return supabaseClient
            .from(this.tableName)
            .delete()
            .eq('tool_id', tool.id)
            .eq('volunteer_id', volunteer.id)
            .then(() => true)
    }

    findToolsByVolunteerId(volunteerId: Identifier): Promise<Tool[]> {
        return supabaseClient
            .from(this.tableName)
            .select('*, tool(*)')
            .eq('volunteer_id', volunteerId)
            .then((resp: any) => resp.data.map((d: any) => d.tool))
    }

}


const volunteer2ToolService = new DASVolunteer2ToolService();

export { volunteer2ToolService };
export type { Volunteer2Tool };

