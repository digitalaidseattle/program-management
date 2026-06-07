/**
 *  AddVolunteerToTeam.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Team2Volunteer } from "../services/dasTeam2VolunteerService";
import { Team } from "../services/dasTeamService";
import { Volunteer } from "../services/dasVolunteerDao";

export function addVolunteerToTeam(_volunteer: Volunteer, _team: Team): Promise<Team2Volunteer> {
      throw new Error('not ready')
  // other steps could go here.
    // maybe audit history or notifications
    // return Team2VolunteerService.getInstance().addVolunteerToTeam(volunteer, team);
}
