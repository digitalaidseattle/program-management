/**
 *  AddDisciplineToVolunteer.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Volunteer } from "../data/types";
import { Discipline } from "../services/dasDisciplineService";

export function removeDisciplineFromVolunteer(_discipline: Discipline, _volunteer: Volunteer): Promise<boolean> {
    throw new Error('not ready')
    // other steps could go here.
    // maybe audit history or notifications
    // return Volunteer2DisciplineService.getInstance()
    //     .removeDisciplineFromVolunteer(discipline, volunteer);
}
