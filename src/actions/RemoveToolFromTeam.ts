/**
 *  AddDisciplineToVolunteer.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Team2ToolService } from "../services/dasTeam2ToolService";
import { Team } from "../services/dasTeamService";
import { Tool } from "../services/dasToolsDao";

export function removeToolFromTeam(tool: Tool, team: Team): Promise<boolean> {
    // other steps could go here.
    // maybe audit history or notifications
    return Team2ToolService.getInstance().removeToolFromTeam(tool, team);
}
