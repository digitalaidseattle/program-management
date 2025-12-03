/**
 *  DASTeam2ToolService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Identifier } from "@digitalaidseattle/core";
import { supabaseClient } from "@digitalaidseattle/supabase";
import { Team } from "./dasTeamService";
import { Tool } from "./dasToolsService";
import { AssociativeTableService } from "./associativeTableService";

type Team2Tool = {
    team_id: string,
    tool_id: string,
    tool?: Tool,
    team?: Team
}

const ASSOC_TABLE = 'team2tool';
class DASTeam2ToolService extends AssociativeTableService<Team2Tool> {
    constructor() {
        super(ASSOC_TABLE)
    }

    async addToolToTeam(tool: Tool, team: Team): Promise<Team2Tool> {
        return supabaseClient
            .from(this.tableName)
            .insert(
                {
                    tool_id: tool.id,
                    team_id: team.id,
                }
            )
            .select()
            .then((resp: any) => resp.data)
    }

    async removeToolFromTeam(tool: Tool, team: Team): Promise<boolean> {
        return supabaseClient
            .from(this.tableName)
            .delete()
            .eq('tool_id', tool.id)
            .eq('team_id', team.id)
            .then(() => true)
    }

    async findToolsByTeamId(teamId: Identifier): Promise<Tool[]> {
        return supabaseClient
            .from(this.tableName)
            .select('*, tool(*)')
            .eq('team_id', teamId)
            .then((resp: any) => resp.data.map((d: any) => d.tool))
    }

    async findByTeamId(teamId: Identifier): Promise<Team2Tool[]> {
        return supabaseClient
            .from(this.tableName)
            .select('*, tool(*)')
            .eq('team_id', teamId)
            .then((resp: any) => resp.data)
    }

    async findTeamsByToolId(toolId: string): Promise<Team[]> {
        return supabaseClient
            .from(this.tableName)
            .select('*, team(*)')
            .eq('tool_id', toolId)
            .then((resp: any) => resp.data.map((d: any) => d.team))
    }

}

const team2ToolService = new DASTeam2ToolService();

export { team2ToolService };
export type { Team2Tool };

