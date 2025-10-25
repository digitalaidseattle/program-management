/**
 *  AddVolunteerToTeam.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { team2VolunteerService } from "../services/dasTeam2VolunteerService";
import { Team } from "../services/dasTeamService";
import { Volunteer } from "../services/dasVolunteerService";

export function addVolunteerToTeam(volunteer: Volunteer, team: Team): Promise<boolean> {
    // other steps could go here.
    // maybe audit history or notifications
    return team2VolunteerService.addVolunteerToTeam(volunteer, team);
}
