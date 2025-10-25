/**
 *  AddDisciplineToVolunteer.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Discipline } from "../services/dasDisciplineService";
import { volunteer2DisciplineService } from "../services/dasVolunteer2DisciplineService";
import { Volunteer } from "../services/dasVolunteerService";

export function addDisciplineToVolunteer(discipline: Discipline, volunteer: Volunteer): Promise<boolean> {
    // other steps could go here.
    // maybe audit history or notifications
    return volunteer2DisciplineService.addDisciplineToVolunteer(discipline, volunteer);
}
