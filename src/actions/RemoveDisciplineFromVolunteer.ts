/**
 *  AddDisciplineToVolunteer.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Discipline } from "../services/dasDisciplineService";
import { Volunteer2DisciplineService } from "../services/dasVolunteer2DisciplineService";
import { Volunteer } from "../services/dasVolunteerService";

export function removeDisciplineFromVolunteer(discipline: Discipline, volunteer: Volunteer): Promise<boolean> {
    // other steps could go here.
    // maybe audit history or notifications
    return Volunteer2DisciplineService.getInstance()
        .removeDisciplineFromVolunteer(discipline, volunteer);
}
