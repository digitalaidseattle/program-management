/**
 *  dasVolunteer2ToolService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Identifier } from "@digitalaidseattle/core";
import { SupabaseConfiguration } from "@digitalaidseattle/supabase";
import { AssociativeTableService } from "./associativeTableService";
import { Tool } from "./dasToolsDao";
import { Volunteer } from "./dasVolunteerDao";


type Volunteer2Tool = {
    volunteer_id: string,
    tool_id: string,
    expert: boolean,
    tool?: Tool
    volunteer?: Volunteer
}

const ASSOC_TABLE = 'volunteer2tool';
class Volunteer2ToolService extends AssociativeTableService<Volunteer2Tool> {
    static _instance: Volunteer2ToolService;

    static getInstance(): Volunteer2ToolService {
        if (!this._instance) {
            this._instance = new Volunteer2ToolService();
        }
        return this._instance;
    }

    constructor() {
        super(ASSOC_TABLE)
    }

    async update(volunteer2Tool: Volunteer2Tool, updates: Partial<Volunteer2Tool>): Promise<Volunteer2Tool> {
        return SupabaseConfiguration.getInstance().getSupabaseClient()
            .from(this.tableName)
            .update(updates)
            .eq('tool_id', volunteer2Tool.tool_id)
            .eq('volunteer_id', volunteer2Tool.volunteer_id)
            .select()
            .then((resp: any) => resp.data);
    }

    async addToolToVolunteer(tool: Tool, volunteer: Volunteer): Promise<boolean> {
        return SupabaseConfiguration.getInstance().getSupabaseClient()
            .from(this.tableName)
            .insert(
                {
                    tool_id: tool.id,
                    volunteer_id: volunteer.id,
                }
            )
            .select()
            .then((resp: any) => resp.data);
    }

    async removeToolFromVolunteer(tool: Tool, volunteer: Volunteer): Promise<boolean> {
        return SupabaseConfiguration.getInstance().getSupabaseClient()
            .from(this.tableName)
            .delete()
            .eq('tool_id', tool.id)
            .eq('volunteer_id', volunteer.id)
            .then(() => true)
    }

    async findToolsByVolunteerId(volunteerId: Identifier): Promise<Tool[]> {
        return SupabaseConfiguration.getInstance().getSupabaseClient()
            .from(this.tableName)
            .select('*, tool(*)')
            .eq('volunteer_id', volunteerId)
            .then((resp: any) => resp.data.map((d: any) => d.tool))
    }

    async findByVolunteerId(volunteerId: Identifier): Promise<Volunteer2Tool[]> {
        return SupabaseConfiguration.getInstance().getSupabaseClient()
            .from(this.tableName)
            .select('*, tool(*)')
            .eq('volunteer_id', volunteerId)
            .then((resp: any) => resp.data);
    }

    async findVolunteersByToolId(id: string): Promise<Volunteer[]> {
        return SupabaseConfiguration.getInstance().getSupabaseClient()
            .from(this.tableName)
            .select('*, volunteer(*, profile(*))')
            .eq('tool_id', id)
            .then((resp: any) => resp.data.map((d: any) => d.volunteer));
    }
}


export { Volunteer2ToolService };
export type { Volunteer2Tool };

