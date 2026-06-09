/**
 *  dasVolunteerService.ts
 *
 *  @copyright 20245Digital Aid Seattle
 *
 */

import { PageInfo, QueryModel } from "@digitalaidseattle/core";
import { ProfileService } from "./dasProfileService";
import { VolunteerDao } from "../data/coda/VolunteerDao";
import { Team, Volunteer } from "../data/types";

class VolunteerService {

    private static instance: VolunteerService;

    public static getInstance(): VolunteerService {
        if (!VolunteerService.instance) {
            this.instance = new VolunteerService();
        }
        return VolunteerService.instance;
    }

    dao: VolunteerDao;
    private constructor() {
        this.dao = VolunteerDao.getInstance();
    }

    getDao(): VolunteerDao {
        return this.dao as VolunteerDao;
    }

    empty(): Volunteer {
        const profile = ProfileService.getInstance().empty();
        return this.getDao().empty(profile);
    }

    async getAll(): Promise<Volunteer[]> {
        return this.getDao().getAll();
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

    async findByDasEmail(email: string): Promise<Volunteer | null> {
        const volunteers = await this.getDao().findBy('email', email);
        return volunteers.length === 1 ? volunteers[0] : null;
    }

    async findTeams(id: string): Promise<Team[]> {
        const volunteer = await this.getDao().getById(id);
        console.log(volunteer)
        return volunteer!.teams!;
    }
}

export { VolunteerService };
export type { Volunteer };

