/**
 *  dasVolunteerService.ts
 *
 *  @copyright 20245Digital Aid Seattle
 *
 */

import { PageInfo, QueryModel } from "@digitalaidseattle/core";
import { SupabaseEntityService } from "@digitalaidseattle/supabase";
import { Volunteer, VolunteerDao } from './dasVolunteerDao';
import { ProfileService } from "./dasProfileService";

class VolunteerService extends SupabaseEntityService<Volunteer> {

    private static instance: VolunteerService;

    public static getInstance(): VolunteerService {
        if (!VolunteerService.instance) {
            this.instance = new VolunteerService();
        }
        return VolunteerService.instance;
    }

    empty(): Volunteer {
        const profile = ProfileService.getInstance().empty();
        return this.getDao().empty(profile);
    }

    public constructor() {
        super(VolunteerDao.getInstance());
    }

    getDao(): VolunteerDao {
        return this.dao as VolunteerDao;
    }

    async find(queryModel: QueryModel): Promise<PageInfo<Volunteer>> {
        return this.getDao().find(queryModel);
    }

    async getActive(): Promise<Volunteer[]> {
        return this.getDao().getActive();
    }

    async findCadreVolunteers(): Promise<Volunteer[]> {
        return this.getDao().findCadreVolunteers();
    }

    async findByAirtableId(airtableId: string): Promise<Volunteer> {
        return await this.getDao().findByAirtableId(airtableId);
    }

    async findByDasEmail(email: string): Promise<Volunteer> {
        return this.getDao().findByDasEmail(email);
    }
}

export { VolunteerService };
export type { Volunteer };

