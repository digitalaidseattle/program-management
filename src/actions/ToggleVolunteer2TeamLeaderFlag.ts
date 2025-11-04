/**
 *  ToggleVolunteer2ToolExportFlag.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Team2Volunteer, team2VolunteerService } from "../services/dasTeam2VolunteerService";


export function toggleVolunteer2TeamLeaderFlag(t2v: Team2Volunteer): Promise<Team2Volunteer> {
    // other steps could go here.
    // maybe audit history or notifications
    const newValue = t2v.leader === undefined ? true : !t2v.leader;
    return team2VolunteerService.update(t2v, { leader: newValue })
}