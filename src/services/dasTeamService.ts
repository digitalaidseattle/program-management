/**
 *  dasTeamService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Identifier } from "@digitalaidseattle/core";
import { supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";
import { Volunteer } from "./dasVolunteerService";


type Team = {
    id: string,
    airtable_id: string,
    team_name: string,
    volunteer_ids: string[],
    welcome_message: string,
    okrs: string,
    forecast_ids: string,
    purpose: string,
    status: string,
    leader_ids: string[],
    tool_ids: string[],
    decision_making: string,
    not_included: string,
    knowledge_management: string,
    new_to_the_team: string,
    slack_channel: string,
    volunteer?: Volunteer[]
}
const DEFAULT_SELECT = "*, volunteer(*, profile(*))"
class TeamService extends SupabaseEntityService<Team> {
    public constructor() {
        super("team");
    }

    getById(entityId: Identifier, _select?: string): Promise<Team | null> {
        return super.getById(entityId, DEFAULT_SELECT)
    }

    async findByAirtableId(airtableId: string): Promise<Team> {
        return await supabaseClient
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('airtable_id', airtableId)
            .single()
            .then((resp: any) => resp.data);
    }
}

const teamService = new TeamService();

export { teamService };
export type { Team };

