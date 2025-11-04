/**
 *  ToggleVolunteer2DisciplineSeniorFlag.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Volunteer2Discipline, volunteer2DisciplineService } from "../services/dasVolunteer2DisciplineService";

export function toggleVolunteer2DisciplineSeniorFlag(v2d: Volunteer2Discipline): Promise<Volunteer2Discipline> {
    // other steps could go here.
    // maybe audit history or notifications
    const newValue = v2d.senior === undefined ? true : !v2d.senior;
    return volunteer2DisciplineService.update(v2d, { senior: newValue })
}