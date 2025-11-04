/**
 *  ToggleVolunteer2ToolExportFlag.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Volunteer2Tool, volunteer2ToolService } from "../services/dasVolunteer2ToolService";

export function toggleVolunteer2ToolExpertFlag(v2t: Volunteer2Tool): Promise<Volunteer2Tool> {
    // other steps could go here.
    // maybe audit history or notifications
    const newValue = v2t.expert === undefined ? true : !v2t.expert;
    return volunteer2ToolService.update(v2t, { expert: newValue })
}