/**
 *  VolunteerDao.ts
 *
 *  types, classes that support the mapping example
 * 
 *  @copyright 2026 Digital Aid Seattle
 *
 */

import { CodaDao } from "../../services/coda/CodaDao";
import { Profile } from "../../services/dasProfileDao";
import { Volunteer } from "../types";

const DOC_ID = "24QYb2RP0g";
const TABLE_ID = "grid-4vzF6VuaPV";

export class VolunteerDao extends CodaDao<Volunteer> {

    private static instance: VolunteerDao;

    public static getInstance(): VolunteerDao {
        if (!VolunteerDao.instance) {
            this.instance = new VolunteerDao(
                DOC_ID,
                TABLE_ID,
                {
                    mapper: (json) => {
                        const values = json.values;
                        console.log(values)
                        return {
                            id: json.id,
                            name: CodaDao.removeBackTicks(values["Name"]),
                            role: values["Role"] ? values["Role"].name : "",
                            pic: values["Pic"] ? values["Pic"][0].url : "",
                            location: CodaDao.removeBackTicks(values["Location"]),
                            status: CodaDao.removeBackTicks(values["Status"]),
                            linkedin: values["Linkedin URL"] ? values["Linkedin URL"].url : "",
                            email: CodaDao.removeBackTicks(values["Personal email"]),
                            join_date: new Date(values["Join date"]),
                        } as Volunteer
                    }
                }
            );
        }
        return VolunteerDao.instance;
    }

    empty(profile: Profile): Volunteer {
        console.log(profile)
        throw new Error("Method not implemented.");
    }

    async findByDasEmail(email: string): Promise<Volunteer | null> {
        const found = await this.findBy('email', email);
        if (found.length === 1) {
            return found[0]
        }
        return null;
    }

    async findCadreVolunteers(): Promise<Volunteer[]> {
        throw new Error("Method not implemented.");
    }

    async getActive(): Promise<Volunteer[]> {
        return this.findBy('Status', 'Active');
    }

}