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
}

const ASSOC_TABLE = 'team2tool';
class DASTeam2ToolService extends AssociativeTableService<Team2Tool> {

    constructor() {
        super(ASSOC_TABLE)
    }

    addToolToTeam(tool: Tool, team: Team): Promise<boolean> {
        return supabaseClient
            .from(this.tableName)
            .insert(
                {
                    tool_id: tool.id,
                    team_id: team.id,
                }
            )
            .select();
    }

    removeToolFromTeam(tool: Tool, team: Team): Promise<boolean> {
        return supabaseClient
            .from(this.tableName)
            .delete()
            .eq('tool_id', tool.id)
            .eq('team_id', team.id)
            .then(() => true)
    }

    findToolsByTeamId(teamId: Identifier): Promise<Tool[]> {
        return supabaseClient
            .from(this.tableName)
            .select('*, tool(*)')
            .eq('team_id', teamId)
            .then((resp: any) => resp.data.map((d: any) => d.tool))
    }

}

const team2ToolService = new DASTeam2ToolService();

export { team2ToolService };
export type { Team2Tool };

