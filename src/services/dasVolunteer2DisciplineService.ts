/**
 *  dasVolunteer2Discipline.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Identifier } from "@digitalaidseattle/core";
import { Discipline } from "./dasDisciplineService";
import { AssociativeTableService } from "./associativeTableService";
import { SupabaseConfiguration } from "@digitalaidseattle/supabase";
import { Volunteer } from "./dasVolunteerDao";


type Volunteer2Discipline = {
    volunteer_id: string,
    discipline_id: string,
    senior: boolean,
    details: string,
    volunteer?: Volunteer,
    discipline?: Discipline
}

const ASSOC_TABLE = 'volunteer2discipline';
class Volunteer2DisciplineService extends AssociativeTableService<Volunteer2Discipline> {
    static _instance: Volunteer2DisciplineService;

    static getInstance(): Volunteer2DisciplineService {
        if (!this._instance) {
            this._instance = new Volunteer2DisciplineService();
        }
        return this._instance;
    }
    constructor() {
        super(ASSOC_TABLE)
    }

    async update(volunteer2Discipline: Volunteer2Discipline, updates: Partial<Volunteer2Discipline>): Promise<Volunteer2Discipline> {
        return SupabaseConfiguration.getInstance().getSupabaseClient()
            .from(this.tableName)
            .update(updates)
            .eq('volunteer_id', volunteer2Discipline.volunteer_id)
            .eq('discipline_id', volunteer2Discipline.discipline_id)
            .select()
            .then((resp: any) => resp.data)
    }

    async addDisciplineToVolunteer(discipline: Discipline, volunteer: Volunteer): Promise<Volunteer2Discipline> {
        return SupabaseConfiguration.getInstance().getSupabaseClient()
            .from(this.tableName)
            .insert(
                {
                    discipline_id: discipline.id,
                    volunteer_id: volunteer.id,
                }
            )
            .select()
            .then((resp: any) => resp.data)
    }

    async removeDisciplineFromVolunteer(discipline: Discipline, volunteer: Volunteer): Promise<boolean> {
        return SupabaseConfiguration.getInstance().getSupabaseClient()
            .from(this.tableName)
            .delete()
            .eq('discipline_id', discipline.id)
            .eq('volunteer_id', volunteer.id)
            .then(() => true)
    }

    async findDisciplinesByVolunteerId(volunteerId: Identifier): Promise<Discipline[]> {
        return SupabaseConfiguration.getInstance().getSupabaseClient()
            .from(this.tableName)
            .select('*, discipline(*)')
            .eq('volunteer_id', volunteerId)
            .then((resp: any) => resp.data.map((d: any) => d.discipline))
    }


    async findVolunteersByDisciplineId(disciplineId: Identifier): Promise<Volunteer[]> {
        return SupabaseConfiguration.getInstance().getSupabaseClient()
            .from(this.tableName)
            .select('*, volunteer(*, profile(*))')
            .eq('discipline_id', disciplineId)
            .then((resp: any) => resp.data.map((d: any) => d.volunteer))
    }

    async findByDisciplineId(disciplineId: Identifier): Promise<Volunteer2Discipline[]> {
        return SupabaseConfiguration.getInstance().getSupabaseClient()
            .from(this.tableName)
            .select('*, volunteer(*, profile(*))')
            .eq('discipline_id', disciplineId)
            .then((resp: any) => resp.data)
    }

    async findByVolunteerId(volunteerId: Identifier): Promise<Volunteer2Discipline[]> {
        return SupabaseConfiguration.getInstance().getSupabaseClient()
            .from(this.tableName)
            .select('*, discipline(*)')
            .eq('volunteer_id', volunteerId)
            .then(async (resp: any) => await resp.data)
    }

}


export { Volunteer2DisciplineService };
export type { Volunteer2Discipline };

