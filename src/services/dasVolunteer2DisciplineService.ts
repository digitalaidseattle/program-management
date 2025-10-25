/**
 *  dasVolunteer2Discipline.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Identifier } from "@digitalaidseattle/core";
import { supabaseClient } from "@digitalaidseattle/supabase";
import { Discipline } from "./dasDisciplineService";
import { Volunteer } from "./dasVolunteerService";
import { AssociativeTableService } from "./associativeTableService";


type Volunteer2Discipline = {
    volunteer_id: string,
    discipline_id: string,
    senior: boolean,
    details: string,
    volunteer?: Volunteer,
    discipline?: Discipline
}

const ASSOC_TABLE = 'volunteer2discipline';
class DASVolunteer2DisciplineService extends AssociativeTableService<Volunteer2Discipline> {

    constructor() {
        super(ASSOC_TABLE)
    }

    update(volunteer2Discipline: Volunteer2Discipline, updates: Partial<Volunteer2Discipline>): Promise<Volunteer2Discipline> {
        return supabaseClient
            .from(this.tableName)
            .update(updates)
            .eq('volunteer_id', volunteer2Discipline.volunteer_id)
            .eq('discipline_id', volunteer2Discipline.discipline_id)
            .select();
    }

    addDisciplineToVolunteer(discipline: Discipline, volunteer: Volunteer): Promise<boolean> {
        return supabaseClient
            .from(this.tableName)
            .insert(
                {
                    discipline_id: discipline.id,
                    volunteer_id: volunteer.id,
                }
            )
            .select();
    }

    removeDisciplineFromVolunteer(discipline: Discipline, volunteer: Volunteer): Promise<boolean> {
        return supabaseClient
            .from(this.tableName)
            .delete()
            .eq('discipline_id', discipline.id)
            .eq('volunteer_id', volunteer.id)
            .then(() => true)
    }

    findDisciplinesByVolunteerId(volunteerId: Identifier): Promise<Discipline[]> {
        return supabaseClient
            .from(this.tableName)
            .select('*, discipline(*)')
            .eq('volunteer_id', volunteerId)
            .then((resp: any) => resp.data.map((d: any) => d.discipline))
    }


    findVolunteersByDisciplineId(disciplineId: Identifier): Promise<Volunteer[]> {
        return supabaseClient
            .from(this.tableName)
            .select('*, volunteer(*, profile(*))')
            .eq('discipline_id', disciplineId)
            .then((resp: any) => resp.data.map((d: any) => d.volunteer))
    }

    findByDisciplineId(disciplineId: Identifier): Promise<Volunteer2Discipline[]> {
        return supabaseClient
            .from(this.tableName)
            .select('*, volunteer(*, profile(*))')
            .eq('discipline_id', disciplineId)
            .then((resp: any) => resp.data)
    }

    findByVolunteerId(volunteerId: Identifier): Promise<Volunteer2Discipline[]> {
        return supabaseClient
            .from(this.tableName)
            .select('*, discipline(*)')
            .eq('volunteer_id', volunteerId)
            .then(async (resp: any) => await resp.data)
    }

}


const volunteer2DisciplineService = new DASVolunteer2DisciplineService();

export { volunteer2DisciplineService };
export type { Volunteer2Discipline };

