/**
 *  AddDisciplineToVolunteer.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Discipline } from "../services/dasDisciplineService";
import { Volunteer2Discipline, Volunteer2DisciplineService } from "../services/dasVolunteer2DisciplineService";
import { Volunteer } from "../services/dasVolunteerDao";

export function addDisciplineToVolunteer(discipline: Discipline, volunteer: Volunteer): Promise<Volunteer2Discipline> {
    // other steps could go here.
    // maybe audit history or notifications
    return Volunteer2DisciplineService.getInstance()
        .addDisciplineToVolunteer(discipline, volunteer);
}
