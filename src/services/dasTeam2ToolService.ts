/**
 *  DASTeam2ToolService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Identifier } from "@digitalaidseattle/core";
import { Team } from "./dasTeamService";
import { AssociativeTableService } from "./associativeTableService";
import { Tool } from "./dasToolsDao";

type Team2Tool = {
    team_id: string,
    tool_id: string,
    tool?: Tool,
    team?: Team
}

const ASSOC_TABLE = 'team2tool';
class Team2ToolService extends AssociativeTableService<Team2Tool> {
    
    static _instance: Team2ToolService;

    static getInstance(): Team2ToolService {
        if (!this._instance) {
            this._instance = new Team2ToolService();
        }
        return this._instance;
    }

    constructor() {
        super(ASSOC_TABLE)
    }

    async addToolToTeam(tool: Tool, team: Team): Promise<Team2Tool> {
        return this.getClient()
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
        return this.getClient()
            .from(this.tableName)
            .delete()
            .eq('tool_id', tool.id)
            .eq('team_id', team.id)
            .then(() => true)
    }

    async findToolsByTeamId(teamId: Identifier): Promise<Tool[]> {
        return this.getClient()
            .from(this.tableName)
            .select('*, tool(*)')
            .eq('team_id', teamId)
            .then((resp: any) => resp.data.map((d: any) => d.tool))
    }

    async findByTeamId(teamId: Identifier): Promise<Team2Tool[]> {
        return this.getClient()
            .from(this.tableName)
            .select('*, tool(*)')
            .eq('team_id', teamId)
            .then((resp: any) => resp.data)
    }

    async findTeamsByToolId(toolId: string): Promise<Team[]> {
        return this.getClient()
            .from(this.tableName)
            .select('*, team(*)')
            .eq('tool_id', toolId)
            .then((resp: any) => resp.data.map((d: any) => d.team))
    }

}

export { Team2ToolService };
export type { Team2Tool };

