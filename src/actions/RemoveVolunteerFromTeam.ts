/**
 *  AddDisciplineToVolunteer.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Team2VolunteerService } from "../services/dasTeam2VolunteerService";
import { Team } from "../services/dasTeamService";
import { Volunteer } from "../services/dasVolunteerDao";

export function removeVolunteerFromTeam(volunteer: Volunteer, team: Team): Promise<boolean> {
    // other steps could go here.
    // maybe audit history or notifications
    return Team2VolunteerService.getInstance().removeVolunteerFromTeam(volunteer, team);
}
