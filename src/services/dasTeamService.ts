/**
 *  dasTeamService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { v4 as uuid } from 'uuid';
import { Entity, Identifier } from "@digitalaidseattle/core";
import { PageInfo, QueryModel, supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";
import { Volunteer } from "./dasVolunteerService";
import dayjs from 'dayjs';

type OKR = Entity & {
    team_id: string;
    airtable_id: string;
    title: string;
    description: string;
    health_rating: number;
    start_date: Date;
    end_date: Date;
}

type Forecast = Entity & {
    team_id: string;
    airtable_id: string;
    title: string;
    description: string;
    performance: number;
    status: string;
    start_date: Date;
    end_date: Date;
}

type Team = {
    id: string;
    airtable_id: string;
    name: string;
    volunteer_ids: string[];  // Deprecated: use Team2Volunteer join table instead
    welcome_message: string;
    okrs: string;
    forecast_ids: string;  // Deprecated - airtable artifact
    purpose: string;
    status: string;
    leader_ids: string[];  // Deprecated - airtable artifact
    tool_ids: string[];  // Deprecated - airtable artifact
    decision_making: string;
    not_included: string;
    knowledge_management: string;
    new_to_the_team: string;
    slack_channel: string;
    volunteer?: Volunteer[];
    okr?: OKR[];
    forecast?: Forecast[];
}

const DEFAULT_SELECT = "*, volunteer(*, profile(*)), okr(*), forecast(*)"
class TeamService extends SupabaseEntityService<Team> {
    public constructor() {
        super("team", DEFAULT_SELECT);

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

class OKRService extends SupabaseEntityService<OKR> {
    public constructor() {
        super("okr");
    }

    empty(team: Team): OKR {
        const start = dayjs()
        const end = start.add(2, 'week');
        return {
            id: uuid(),
            team_id: team.id,
            airtable_id: '',
            title: 'Title',
            description: 'Description',
            health_rating: 0,
            start_date: start.toDate(),
            end_date: end.toDate()
        }
    }
}

class ForecastService extends SupabaseEntityService<Forecast> {

    public constructor() {
        super("forecast");
    }

    empty(team: Team): Forecast {
        const start = dayjs()
        const end = start.add(2, 'week');
        return {
            id: uuid(),
            team_id: team.id,
            airtable_id: '',
            title: team.name,
            description: 'Description',
            performance: 0,
            status: '',
            start_date: start.toDate(),
            end_date: end.toDate()
        }
    }
}

const teamService = new TeamService();
const okrService = new OKRService();
const forecastService = new ForecastService();
export { teamService, okrService, forecastService };

export type { Team, OKR, Forecast };

