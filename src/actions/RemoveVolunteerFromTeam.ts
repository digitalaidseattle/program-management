/**
 *  AddDisciplineToVolunteer.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Volunteer } from "../data/types";
import { Team } from "../services/dasTeamService";

export function removeVolunteerFromTeam(_volunteer: Volunteer, _team: Team): Promise<boolean> {
    throw new Error('not ready')
    // other steps could go here.
    // maybe audit history or notifications
    // return Team2VolunteerService.getInstance().removeVolunteerFromTeam(volunteer, team);
}
