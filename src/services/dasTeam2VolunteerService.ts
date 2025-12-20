/**
 *  dasTeam2Volunteer.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Identifier } from "@digitalaidseattle/core";
import { supabaseClient } from "@digitalaidseattle/supabase";
import { AssociativeTableService } from "./associativeTableService";
import { Team } from "./dasTeamService";
import { Volunteer } from "./dasVolunteerService";


type Team2Volunteer = {
    team_id: string,
    volunteer_id: string,
    leader: boolean,
    team?: Team,
    volunteer?: Volunteer
}

const TABLE_TEAM_2_VOLUNTER = 'team2volunteer';
class DASTeam2VolunteerService extends AssociativeTableService<Team2Volunteer> {

    constructor() {
        super(TABLE_TEAM_2_VOLUNTER)
    }

    async update(team2Volunteer: Team2Volunteer, updates: Partial<Team2Volunteer>): Promise<Team2Volunteer> {
        return supabaseClient
            .from(this.tableName)
            .update(updates)
            .eq('team_id', team2Volunteer.team_id)
            .eq('volunteer_id', team2Volunteer.volunteer_id)
            .select()
            .then((resp: any) => resp.data);
    }

    async addVolunteerTeamLeader(volunteer: Volunteer, team: Team, leader: true): Promise<Team2Volunteer> {
        return supabaseClient
            .from(this.tableName)
            .update(
                { leader: leader }
            )
            .eq('volunteer_id', volunteer.id)
            .eq('team_id', team.id)
            .select()
            .then((resp: any) => resp.data);
    }

    async addVolunteerToTeam(volunteer: Volunteer, team: Team): Promise<Team2Volunteer> {
        return supabaseClient
            .from(this.tableName)
            .insert(
                {
                    volunteer_id: volunteer.id,
                    team_id: team.id,
                    leader: false
                }
            )
            .select()
            .then((resp: any) => resp.data);
    }

    async removeVolunteerFromTeam(volunteer: Volunteer, team: Team): Promise<boolean> {
        return supabaseClient
            .from(this.tableName)
            .delete()
            .eq('volunteer_id', volunteer.id)
            .eq('team_id', team.id)
            .then(() => true)
    }

    async findTeamsByVolunteerId(volunteerId: Identifier): Promise<Team[]> {
        return supabaseClient
            .from(this.tableName)
            .select('*, team(*)')
            .eq('volunteer_id', volunteerId)
            .then((resp: any) => resp.data.map((d: any) => d.team))
    }

    async findVolunteersByTeamId(teamId: Identifier): Promise<Volunteer[]> {
        return supabaseClient
            .from(this.tableName)
            .select('*, volunteer(*, profile(*))')
            .eq('team_id', teamId)
            .then((resp: any) => resp.data.map((d: any) => {
                const vol = {
                    ...d.volunteer,
                    leader: d.leader
                }
                return vol;
            }))
    }

    async findByVolunteerId(volunteerId: Identifier): Promise<Team2Volunteer[]> {
        return supabaseClient
            .from(this.tableName)
            .select('*, team(*)')
            .eq('volunteer_id', volunteerId)
            .then((resp: any) => resp.data);
    }

    async findByTeamId(teamId: string): Promise<Team2Volunteer[]> {
        return supabaseClient
            .from(this.tableName)
            .select('*, volunteer(*, profile(*))')
            .eq('team_id', teamId)
            .then((resp: any) => resp.data);
    }

    async findLeaders(): Promise<Team2Volunteer[]> {
        return supabaseClient
            .from(this.tableName)
            .select('*, volunteer(*, profile(*))')
            .eq('leader', true)
            .then((resp: any) => resp.data);
    }

}


const team2VolunteerService = new DASTeam2VolunteerService();

export { team2VolunteerService };
export type { Team2Volunteer };

