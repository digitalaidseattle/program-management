/**
 *  AddVolunteerToTeam.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Team2Volunteer, Team2VolunteerService } from "../services/dasTeam2VolunteerService";
import { Team } from "../services/dasTeamService";
import { Volunteer } from "../services/dasVolunteerDao";

export function addVolunteerToTeam(volunteer: Volunteer, team: Team): Promise<Team2Volunteer> {
    // other steps could go here.
    // maybe audit history or notifications
    return Team2VolunteerService.getInstance().addVolunteerToTeam(volunteer, team);
}
