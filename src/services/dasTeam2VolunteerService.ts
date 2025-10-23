/**
 *  dasTeam2Volunteer.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Identifier, User } from "@digitalaidseattle/core";
import { supabaseClient } from "@digitalaidseattle/supabase";
import { Team } from "./dasTeamService";
import { Volunteer } from "./dasVolunteerService";
import { AssociativeTableService } from "./associativeTableService";


type Team2Volunteer = {
    team_id: string,
    volunteer_id: string,
    leader: boolean
}

const TABLE_TEAM_2_VOLUNTER = 'team2volunteer';
class DASTeam2VolunteerService extends AssociativeTableService<Team2Volunteer> {

    constructor() {
        super(TABLE_TEAM_2_VOLUNTER)
    }

    addVolunteerTeamLeader(volunteer: Volunteer, team: Team, leader: true): Promise<boolean> {
        return supabaseClient
            .from(this.tableName)
            .update(
                { leader: leader }
            )
            .eq('volunteer_id', volunteer.id)
            .eq('team_id', team.id)
            .select();
    }

    addVolunteerToTeam(volunteer: Volunteer, team: Team): Promise<boolean> {
        console.log(volunteer, team)
        return supabaseClient
            .from(this.tableName)
            .insert(
                {
                    volunteer_id: volunteer.id,
                    team_id: team.id,
                    leader: false
                }
            )
            .select();
    }

    removeVolunteerFromTeam(volunteer: Volunteer, team: Team): Promise<boolean> {
        return supabaseClient
            .from(this.tableName)
            .delete()
            .eq('volunteer_id', volunteer.id)
            .eq('team_id', team.id)
            .then(() => true)
    }

    findTeamsByVolunteerId(volunteerId: Identifier): Promise<Team[]> {
        return supabaseClient
            .from(this.tableName)
            .select('*, team(*)')
            .eq('volunteer_id', volunteerId)
            .then((resp: any) => resp.data.map((d: any) => d.team))
    }

    findVolunteersByTeamId(teamId: Identifier): Promise<Volunteer[]> {
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

}


const team2VolunteerService = new DASTeam2VolunteerService();

export { team2VolunteerService };
export type { Team2Volunteer };

